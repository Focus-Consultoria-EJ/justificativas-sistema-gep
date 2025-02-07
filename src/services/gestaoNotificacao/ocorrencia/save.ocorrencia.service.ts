import { ENABLE_UPLOAD_FILES, FILE_MAX_SIZE } from "../../../config/multer";
import SharkRepository from "../../../database/repositories/SharkRepository";
import NivelAdvertenciaRepository from "../../../database/repositories/gestaoNotificacao/NivelAdvertenciaRepository";
import NivelGratificacaoRepository from "../../../database/repositories/gestaoNotificacao/NivelGratificacaoRepository";
import OcorrenciaRepository from "../../../database/repositories/gestaoNotificacao/OcorrenciaRepository";
import TipoAssuntoRepository from "../../../database/repositories/gestaoNotificacao/TipoAssuntoRepository";
import TipoOcorrenciaRepository from "../../../database/repositories/gestaoNotificacao/TipoOcorrenciaRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { ocorrenciaFormValidation } from "../../../helpers/gestaoNotificacao/ocorrenciaValidation";
import { checkId, valueExists } from "../../../helpers/validation";
import {
  BadRequestError,
  InternalServerError,
} from "../../../middlewares/Error.middleware";
import { Shark } from "../../../models/Shark";
import ocEmailNotificaService from "../ocorrenciaEmailNotification/ocorrenciaEmailNotification.service";
import saveOcorrenciaUploadFileService from "./UploadFIle/save.ocorrencia.uploadFile.service";

class SaveOcorrenciaService {
  /**
   * Serviço responsável pela inserção ou atualização de uma ocorrência se o id for passado no parâmetro data.
   * @param data - os dados vindos do header.
   * @param reqShark - os dados do shark salvo na requisição do Express.
   */
  async execute(
    data: any,
    reqShark: Shark,
    file?: Express.Multer.File
  ): Promise<void> {
    data.id = checkId(data.id);

    const ocorrencia = await ocorrenciaFormValidation(data);
    let ocorrenciaASerAtualizada;

    if (file) {
      if (file.size >= FILE_MAX_SIZE)
        throw new BadRequestError("O arquivo deve ser menor que 3MB.");
    }

    if (typeof ocorrencia === "string") throw new BadRequestError(ocorrencia);

    if (ocorrencia.id) {
      ocorrenciaASerAtualizada = await OcorrenciaRepository.getById(
        ocorrencia.id!
      );

      if (!ocorrenciaASerAtualizada)
        throw new BadRequestError(errMsg.OCORRENCIA.NOT_FOUND);

      // Impede que a ocorrência a ser atualizada se o shark referênte for diferente do shark referênte original da ocorrência.
      if (ocorrenciaASerAtualizada != undefined) {
        if (
          ocorrenciaASerAtualizada.sharkReferente.id !==
          ocorrencia.sharkReferente.id
        )
          ocorrencia.sharkReferente.id =
            ocorrenciaASerAtualizada.sharkReferente.id;
      }
    }

    // Seta o id do shark logado como shark criador da ocorrência
    ocorrencia.sharkCriador!.id = reqShark.id;

    // Se não tiver passado o sharkReferente, pega o próprio shark
    ocorrencia.sharkReferente.id = ocorrencia.sharkReferente.id
      ? ocorrencia.sharkReferente.id
      : reqShark.id;

    const dataSharkReferente = await SharkRepository.getById(
      ocorrencia.sharkReferente.id!
    );
    valueExists(dataSharkReferente, errMsg.SHARK.REFERENCE_NOT_FOUND);

    const tipoOcorrencia = await TipoOcorrenciaRepository.getById(
      ocorrencia.tipoOcorrencia.id!
    );
    valueExists(tipoOcorrencia, errMsg.TIPO_OCORRENCIA.NOT_FOUND);

    const tipoAssunto = await TipoAssuntoRepository.getById(
      ocorrencia.tipoAssunto.id!
    );
    valueExists(tipoAssunto, errMsg.TIPO_ASSUNTO.NOT_FOUND);

    ocorrencia.tipoOcorrencia = tipoOcorrencia!;
    ocorrencia.tipoAssunto = tipoAssunto!;
    ocorrencia.sharkReferente = dataSharkReferente!; // salva os dados do shark referente

    // Bloqueia o usuário comum (não de GEP) de enviar uma ocorrência que não seja do tipo justificativa
    if (
      reqShark.celula.id !== 3 &&
      reqShark.role?.id !== 3 &&
      ocorrencia.tipoOcorrencia.id != 1
    )
      throw new BadRequestError(
        "Um usuário que não é de Gestão Estratégica de Pessoas só pode enviar ocorrências do tipo justificativa."
      );

    // Bloqueia o usuário comum (não de GEP) de enviar uma ocorrência relacionada a outro usuário
    if (
      reqShark.celula.id !== 3 &&
      reqShark.role?.id !== 3 &&
      ocorrencia.sharkCriador?.id != ocorrencia.sharkReferente.id
    )
      throw new BadRequestError(
        "Um usuário que não é de Gestão Estratégica de Pessoas só pode criar ocorrências referente a ele mesmo."
      );

    // Bloqueia que uma ocorrência que não seja do tipo advertência ou gratificação receba os níveis
    if (
      (ocorrencia.tipoOcorrencia.id === 1 ||
        ocorrencia.tipoOcorrencia.id === 2 ||
        ocorrencia.tipoOcorrencia.id === 3 ||
        ocorrencia.tipoOcorrencia.id === 4) &&
      (ocorrencia.nivelAdvertencia?.id || ocorrencia.nivelGratificacao?.id)
    )
      throw new BadRequestError(
        "Este tipo de ocorrência não pode receber nível de advertência ou gratificação."
      );
    else if (
      ocorrencia.tipoOcorrencia.id === 5 &&
      ocorrencia.nivelAdvertencia?.id
    )
      throw new BadRequestError(
        "Este tipo de ocorrência não pode receber nível de advertência."
      );
    else if (
      ocorrencia.tipoOcorrencia.id === 6 &&
      ocorrencia.nivelGratificacao?.id
    )
      throw new BadRequestError(
        "Este tipo de ocorrência não pode receber nível de gratificação."
      );

    // Ocorrência do tipo aviso
    if (ocorrencia.tipoOcorrencia.id === 4) {
      // Verifica se é um segundo aviso
      if (await OcorrenciaRepository.getAvisoRepetido(ocorrencia)) {
        // Se for um segundo aviso, reseta a contagem e define o próximo aviso como comum
        ocorrencia.valorMetragem = 2; // ou qualquer valor que represente um aviso comum
        // Aqui você pode adicionar lógica adicional para resetar a contagem de avisos
        // Por exemplo, você pode atualizar o status do shark referente para indicar que a contagem foi resetada
      } else {
        // Se for o primeiro aviso, define o valor da metragem conforme necessário
        ocorrencia.valorMetragem = 0; // ou qualquer valor que represente o primeiro aviso
      }
    }
    // Ocorrência do tipo gratificação
    else if (ocorrencia.tipoOcorrencia.id === 5) {
      if (!ocorrencia.nivelGratificacao?.id)
        throw new BadRequestError(
          "Uma ocorrência do tipo gratificação precisa que o nível da gratificação seja passado."
        );

      const nivelGrat = await NivelGratificacaoRepository.getById(
        ocorrencia.nivelGratificacao.id!
      );
      valueExists(nivelGrat, errMsg.NIVEL_GRATIFICACAO.NOT_FOUND);

      ocorrencia.valorMetragem = Number(nivelGrat?.valor);
    }
    // Ocorrência do tipo Advertência
    else if (ocorrencia.tipoOcorrencia.id === 6) {
      if (!ocorrencia.nivelAdvertencia?.id)
        throw new BadRequestError(
          "Uma ocorrência do tipo advertência precisa que o nível da advertência seja passado."
        );

      const nivelAdver = await NivelAdvertenciaRepository.getById(
        ocorrencia.nivelAdvertencia.id!
      );
      valueExists(nivelAdver, errMsg.NIVEL_ADVERTENCIA.NOT_FOUND);

      ocorrencia.valorMetragem = Number(nivelAdver?.valor);
    }

    if (ocorrencia.id) {
      if (
        ocorrenciaASerAtualizada?.tipoOcorrencia.id === 4 ||
        ocorrenciaASerAtualizada?.tipoOcorrencia.id === 5 ||
        ocorrenciaASerAtualizada?.tipoOcorrencia.id === 6
      )
        throw new BadRequestError(
          "Não é possível atualizar uma ocorrência que é do tipo aviso, gratificação ou advertência."
        );

      await OcorrenciaRepository.update(ocorrencia).then(async (idInserted) => {
        await OcorrenciaRepository.insertOcorrenciaLog(
          2,
          idInserted,
          reqShark.id!
        );

        // Faz o upload do arquivo e atualiza no banco de dados
        if (file && ENABLE_UPLOAD_FILES) {
          await saveOcorrenciaUploadFileService
            .execute(file, ocorrencia, true)
            .catch((err) => {
              throw new InternalServerError(err);
            });
        }

        // Lança o E-mail (Primeiro/Segundo aviso, advertência, gratificação)
        if (
          ocorrencia.tipoOcorrencia.id &&
          ocorrencia.tipoOcorrencia.id >= 4 &&
          ocorrencia.tipoOcorrencia.id <= 6
        ) {
          ocEmailNotificaService.to = ocorrencia.sharkReferente.email;
          const html = ocEmailNotificaService.notificationEmail(
            ocorrencia.sharkReferente,
            ocorrencia
          );
          await ocEmailNotificaService.sendMail(html);
        }
      });
    } else {
      await OcorrenciaRepository.insert(ocorrencia).then(async (idInserted) => {
        await OcorrenciaRepository.insertOcorrenciaLog(
          1,
          idInserted,
          reqShark.id!
        );

        // Faz o upload do arquivo e insere no banco de dados
        if (file && ENABLE_UPLOAD_FILES) {
          ocorrencia.id = idInserted;
          await saveOcorrenciaUploadFileService
            .execute(file, ocorrencia)
            .catch((err) => {
              throw new InternalServerError(err);
            });
        }

        // Lança o E-mail (Primeiro/Segundo aviso, advertência, gratificação)
        if (
          ocorrencia.tipoOcorrencia.id &&
          ocorrencia.tipoOcorrencia.id >= 4 &&
          ocorrencia.tipoOcorrencia.id <= 6
        ) {
          ocEmailNotificaService.to = ocorrencia.sharkReferente.email;
          const html = ocEmailNotificaService.notificationEmail(
            ocorrencia.sharkReferente,
            ocorrencia
          );
          await ocEmailNotificaService.sendMail(html);
        }
      });
    }
  }
}

export default new SaveOcorrenciaService();
