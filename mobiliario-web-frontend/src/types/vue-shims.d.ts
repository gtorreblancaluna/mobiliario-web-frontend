declare module '*.vue' {
    import type { DefineComponent } from 'vue'

    // Define un componente de Vue que puede tener cualquier propiedad
    // y configuración (como el objeto de opciones o un setup function).
    const component: DefineComponent<{}, {}, any>
    export default component
}