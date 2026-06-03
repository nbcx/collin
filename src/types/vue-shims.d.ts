/**
 * @file Declare the module type for *.vue single-file components.
 * @module types/vue-shims
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
