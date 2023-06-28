import Joi from 'joi';
import { getStates, isValidCEP, isValidCPF, isValidMobilePhone } from '@brazilian-utils/brazilian-utils';
import { CreateOrUpdateEnrollmentWithAddress } from '@/services/enrollments-service';

const cpfValidationSchema = Joi.string().length(11).custom(joiCpfValidation).required();

const cepValidationSchema = Joi.string().length(8).custom(JoiCepValidation).required();

const mobilePhoneValidationSchema = Joi.string().min(10).max(11).custom(joiMobilePhoneValidation).required();

export const createOrUpdateEnrollmentSchema = Joi.object<CreateOrUpdateEnrollmentWithAddress>({
  name: Joi.string().min(3).required(),
  cpf: cpfValidationSchema,
  birthday: Joi.string().isoDate().required(),
  phone: mobilePhoneValidationSchema,
  address: Joi.object({
    cep: cepValidationSchema,
    street: Joi.string().required(),
    city: Joi.string().required(),
    number: Joi.string().required(),
    state: Joi.string()
      .length(2)
      .valid(...getStates().map((s) => s.code))
      .required(),
    neighborhood: Joi.string().required(),
    addressDetail: Joi.string().allow(null, ''),
  }).required(),
});

function joiCpfValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  if (!isValidCPF(value)) {
    return helpers.error('any.invalid');
  }

  return value;
}

function JoiCepValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  if (!isValidCEP(value)) {
    return helpers.error('any.invalid');
  }

  return value;
}

function joiMobilePhoneValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  if (!isValidMobilePhone(value)) {
    return helpers.error('any.invalid');
  }

  return value;
}
