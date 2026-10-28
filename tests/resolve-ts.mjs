/**
 * Lets `node --test` load the app's TypeScript modules as written: resolves
 * the `@/` path alias and extensionless relative imports to `.ts` files.
 * Node strips the types itself (Node 22.18+).
 */
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

const src = pathToFileURL(`${process.cwd()}/src/`).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    const target = specifier.startsWith("@/") ? new URL(specifier.slice(2), src).href : specifier;
    try {
      return nextResolve(target, context);
    } catch (error) {
      if (target.startsWith(".") || target.startsWith("file:")) return nextResolve(`${target}.ts`, context);
      throw error;
    }
  },
});
