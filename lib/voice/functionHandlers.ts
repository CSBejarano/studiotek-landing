/**
 * Voice Agent Function Handlers
 *
 * Client-side implementations for voice agent function calls.
 * These handlers execute UI actions triggered by the AI agent.
 */

// ============================================================================
// Types
// ============================================================================

export interface FunctionResult {
  success: boolean;
  message?: string;
  error?: string;
}

type SectionId = 'hero' | 'benefits' | 'services' | 'how-it-works' | 'contact';
type FormFieldName = 'nombre' | 'email' | 'empresa' | 'telefono' | 'mensaje' | 'presupuesto' | 'servicioInteres';

// ============================================================================
// navigate_to_section
// ============================================================================

/**
 * Scrolls smoothly to a specific section of the page
 */
export function navigateToSection(sectionId: SectionId): FunctionResult {
  const sectionNames: Record<SectionId, string> = {
    hero: 'inicio',
    benefits: 'beneficios',
    services: 'servicios',
    'how-it-works': 'como funciona',
    contact: 'contacto',
  };

  try {
    const element = document.getElementById(sectionId);

    if (!element) {
      return {
        success: false,
        error: `Seccion "${sectionId}" no encontrada`,
      };
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    return {
      success: true,
      message: `Navegando a la seccion de ${sectionNames[sectionId]}`,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error al navegar: ${error instanceof Error ? error.message : 'desconocido'}`,
    };
  }
}

// ============================================================================
// highlight_element
// ============================================================================

/**
 * Adds a glow pulse effect to an element temporarily
 */
export function highlightElement(
  elementId: string,
  durationMs: number = 3000
): FunctionResult {
  try {
    const element = document.getElementById(elementId);

    if (!element) {
      return {
        success: false,
        error: `Elemento "${elementId}" no encontrado`,
      };
    }

    // Add highlight class
    element.classList.add('voice-highlight');

    // Remove after duration
    setTimeout(() => {
      element.classList.remove('voice-highlight');
    }, durationMs);

    return {
      success: true,
      message: `Elemento "${elementId}" resaltado`,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error al resaltar: ${error instanceof Error ? error.message : 'desconocido'}`,
    };
  }
}

// ============================================================================
// fill_form_field
// ============================================================================

/**
 * Simulates typing in a form field with a realistic delay
 */
export async function fillFormField(
  fieldName: FormFieldName,
  value: string
): Promise<FunctionResult> {
  // Map field names to selectors
  const fieldSelectors: Record<FormFieldName, string> = {
    nombre: 'input[name="nombre"]',
    email: 'input[name="email"]',
    empresa: 'input[name="empresa"]',
    telefono: 'input[name="telefono"]',
    mensaje: 'textarea[name="mensaje"]',
    presupuesto: 'select[name="presupuesto"]',
    servicioInteres: 'select[name="servicioInteres"]',
  };

  const fieldDisplayNames: Record<FormFieldName, string> = {
    nombre: 'nombre',
    email: 'correo electronico',
    empresa: 'empresa',
    telefono: 'telefono',
    mensaje: 'mensaje',
    presupuesto: 'presupuesto',
    servicioInteres: 'servicio de interes',
  };

  try {
    const selector = fieldSelectors[fieldName];
    const element = document.querySelector(selector) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | null;

    if (!element) {
      return {
        success: false,
        error: `Campo "${fieldName}" no encontrado`,
      };
    }

    // First, scroll the contact section into view
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Wait for scroll to complete
      await sleep(500);
    }

    // Focus the element
    element.focus();

    // For select elements, set value directly
    if (element.tagName === 'SELECT') {
      element.value = value;
      dispatchInputEvents(element);
      return {
        success: true,
        message: `Campo ${fieldDisplayNames[fieldName]} seleccionado`,
      };
    }

    // For input/textarea, simulate typing
    element.value = ''; // Clear first
    dispatchInputEvents(element);

    // Type character by character
    for (let i = 0; i < value.length; i++) {
      element.value = value.substring(0, i + 1);
      dispatchInputEvents(element);
      await sleep(30 + Math.random() * 20); // 30-50ms per character
    }

    // Final blur to trigger validation
    element.blur();

    return {
      success: true,
      message: `Campo ${fieldDisplayNames[fieldName]} rellenado`,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error al rellenar campo: ${error instanceof Error ? error.message : 'desconocido'}`,
    };
  }
}

/**
 * Dispatches input and change events for React form compatibility
 */
function dispatchInputEvents(element: HTMLElement): void {
  // Native input event
  const inputEvent = new Event('input', { bubbles: true, cancelable: true });
  element.dispatchEvent(inputEvent);

  // Change event for React
  const changeEvent = new Event('change', { bubbles: true, cancelable: true });
  element.dispatchEvent(changeEvent);

  // React-specific: set value through native setter to trigger React's onChange
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;
  const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    'value'
  )?.set;
  const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLSelectElement.prototype,
    'value'
  )?.set;

  if (element instanceof HTMLInputElement && nativeInputValueSetter) {
    nativeInputValueSetter.call(element, element.value);
  } else if (element instanceof HTMLTextAreaElement && nativeTextAreaValueSetter) {
    nativeTextAreaValueSetter.call(element, element.value);
  } else if (element instanceof HTMLSelectElement && nativeSelectValueSetter) {
    nativeSelectValueSetter.call(element, element.value);
  }

  // Dispatch again after native setter
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

// ============================================================================
// open_service_modal
// ============================================================================

/**
 * Opens a service modal by dispatching a custom event
 */
export function openServiceModal(serviceIndex: number): FunctionResult {
  const serviceNames = [
    'Implementacion de IA',
    'Consultoria Estrategica',
    'Formacion y Capacitacion',
    'Procesos de IA Personalizada',
  ];

  if (serviceIndex < 0 || serviceIndex > 3) {
    return {
      success: false,
      error: `Indice de servicio invalido: ${serviceIndex}. Debe ser entre 0 y 3.`,
    };
  }

  try {
    // First scroll to services section
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Dispatch custom event for Services component to handle
    const event = new CustomEvent('voice-open-service-modal', {
      detail: { index: serviceIndex },
      bubbles: true,
    });
    document.dispatchEvent(event);

    return {
      success: true,
      message: `Abriendo modal de ${serviceNames[serviceIndex]}`,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error al abrir modal: ${error instanceof Error ? error.message : 'desconocido'}`,
    };
  }
}

// ============================================================================
// submit_contact_form
// ============================================================================

/**
 * Prepares the contact form for submission (does NOT auto-submit for security)
 */
export function submitContactForm(): FunctionResult {
  try {
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Find and highlight the submit button
    const submitButton = document.querySelector(
      '#contact form button[type="submit"]'
    ) as HTMLButtonElement | null;

    if (submitButton) {
      // Highlight the button
      submitButton.classList.add('voice-highlight');
      setTimeout(() => {
        submitButton.classList.remove('voice-highlight');
      }, 5000); // Keep highlighted longer for user to notice
    }

    return {
      success: true,
      message:
        'Formulario listo para enviar. Por favor, revisa los datos y haz click en el boton Enviar mensaje.',
    };
  } catch (error) {
    return {
      success: false,
      error: `Error al preparar envio: ${error instanceof Error ? error.message : 'desconocido'}`,
    };
  }
}

// ============================================================================
// Main Handler - Dispatches function calls
// ============================================================================

export interface FunctionCall {
  name: string;
  arguments: Record<string, unknown>;
}

/**
 * Main dispatcher for voice function calls
 */
export async function handleFunctionCall(
  functionCall: FunctionCall
): Promise<FunctionResult> {
  const { name, arguments: args } = functionCall;

  switch (name) {
    case 'navigate_to_section':
      return navigateToSection(args.section_id as SectionId);

    case 'highlight_element':
      return highlightElement(
        args.element_id as string,
        (args.duration_ms as number) ?? 3000
      );

    case 'fill_form_field':
      return fillFormField(
        args.field_name as FormFieldName,
        args.value as string
      );

    case 'open_service_modal':
      return openServiceModal(args.service_index as number);

    case 'submit_contact_form':
      return submitContactForm();

    default:
      return {
        success: false,
        error: `Funcion desconocida: ${name}`,
      };
  }
}

// ============================================================================
// Utilities
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
