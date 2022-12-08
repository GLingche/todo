import Joi, { ObjectSchema } from 'joi';
const moduleSchema: ObjectSchema = Joi.object().keys({
  type: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Type must be of type string',
    'string.min': 'Invalid type',
    'string.max': 'Invalid type',
    'string.empty': 'Type is a required field'
  }),
  subType: Joi.string().required().min(4).max(8).messages({
    'string.base': 'SubType must be of type string',
    'string.min': 'Invalid subType',
    'string.max': 'Invalid subType',
    'string.empty': 'SubType is a required field'
  }),
  icon: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Icon must be of type string',
    'string.min': 'Invalid icon',
    'string.max': 'Invalid icon',
    'string.empty': 'Icon is a required field'
  }),
});
export { moduleSchema };
