import Joi from 'joi';

/**
 * @param {object} options - Opciones de configuración
 * @param {string[]} options.sortFields - Campos permitidos para ordenar
 * @param {object} options.extraFilters - Filtros adicionales específicos
 * @returns {Joi.ObjectSchema} Schema de paginación configurable
 */
export const createPaginationSchema = ({ 
  sortFields = ['id', 'createdAt'], 
  extraFilters = {} 
} = {}) => {
  const baseSchema = {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().optional().allow(''),
    sortBy: Joi.string().valid(...sortFields).default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  };

  return Joi.object({
    ...baseSchema,
    ...extraFilters
  });
};

export const defaultPaginationSchema = createPaginationSchema();