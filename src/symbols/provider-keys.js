// Para el identificador va a usar un "Symbol".
// Symbol es un tipo de dato nativo que representa un valor único e irrepetible en la ejecución.
// No es ningún dato que conozcamos (es decir, no es un string o número). De hecho, no tiene una representación
// como texto.
// Están diseñados para ser usados como identificadores de claves de objetos o mapas, etc.
// Para crearlo, llamamos a la función "Symbol()".
// Opcionalmente, podemos pasar un parámetro a Symbol que sirva como descripción. Esta descripción se va a mostrar
// si hacemos un console.log() del símbolo.
// Es importante destacar que la descripción *no modifica nada funcionalmente*.
export const globalFeedbackProviderKey = Symbol("Global Feedback Provider Key"); // 👈🏻 Noten que no hay un "new".
// export const globalFeedbackProviderKey = "global-feedback";