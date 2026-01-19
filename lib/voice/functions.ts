/**
 * Voice Agent Functions
 *
 * OpenAI function calling definitions for the voice agent.
 * These functions allow the AI to interact with the landing page.
 */

import type { FunctionDefinition } from './types';

// ============================================================================
// Function Definitions for OpenAI Tools
// ============================================================================

/**
 * Navigation function - scrolls to a specific section
 */
const navigateToSection: FunctionDefinition = {
  name: 'navigate_to_section',
  description: 'Navega a una seccion de la pagina. Usa esto cuando el usuario quiera ver una parte especifica de la web.',
  parameters: {
    type: 'object',
    properties: {
      section_id: {
        type: 'string',
        description: 'ID de la seccion a la que navegar',
        enum: ['hero', 'benefits', 'services', 'how-it-works', 'contact'],
      },
    },
    required: ['section_id'],
  },
};

/**
 * Highlight function - adds a glow effect to an element
 */
const highlightElement: FunctionDefinition = {
  name: 'highlight_element',
  description: 'Resalta un elemento de la pagina con un efecto glow para llamar la atencion del usuario.',
  parameters: {
    type: 'object',
    properties: {
      element_id: {
        type: 'string',
        description: 'ID del elemento a resaltar',
      },
      duration_ms: {
        type: 'number',
        description: 'Duracion del efecto en milisegundos (default: 3000)',
      },
    },
    required: ['element_id'],
  },
};

/**
 * Form fill function - fills a contact form field
 */
const fillFormField: FunctionDefinition = {
  name: 'fill_form_field',
  description: 'Rellena un campo del formulario de contacto con la informacion proporcionada por el usuario.',
  parameters: {
    type: 'object',
    properties: {
      field_name: {
        type: 'string',
        description: 'Nombre del campo a rellenar',
        enum: ['nombre', 'email', 'empresa', 'telefono', 'mensaje'],
      },
      value: {
        type: 'string',
        description: 'Valor a introducir en el campo',
      },
    },
    required: ['field_name', 'value'],
  },
};

/**
 * Service modal function - opens a specific service modal
 */
const openServiceModal: FunctionDefinition = {
  name: 'open_service_modal',
  description: 'Abre el modal de detalles de un servicio especifico para mostrar mas informacion.',
  parameters: {
    type: 'object',
    properties: {
      service_index: {
        type: 'number',
        description: 'Indice del servicio (0: Consultoria, 1: Implementacion, 2: Formacion, 3: IA Personalizada)',
      },
    },
    required: ['service_index'],
  },
};

/**
 * Submit form function - indicates form is ready to submit
 */
const submitContactForm: FunctionDefinition = {
  name: 'submit_contact_form',
  description: 'Indica al usuario que el formulario de contacto esta completo y listo para enviar.',
  parameters: {
    type: 'object',
    properties: {},
  },
};

// ============================================================================
// Exported Functions Array
// ============================================================================

/**
 * All available voice functions for OpenAI function calling
 */
export const voiceFunctions: FunctionDefinition[] = [
  navigateToSection,
  highlightElement,
  fillFormField,
  openServiceModal,
  submitContactForm,
];

/**
 * Convert FunctionDefinition array to OpenAI tools format
 */
export function toOpenAITools(functions: FunctionDefinition[]) {
  return functions.map((fn) => ({
    type: 'function' as const,
    function: {
      name: fn.name,
      description: fn.description,
      parameters: fn.parameters,
    },
  }));
}

/**
 * Get a function definition by name
 */
export function getFunctionByName(name: string): FunctionDefinition | undefined {
  return voiceFunctions.find((fn) => fn.name === name);
}
