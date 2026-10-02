import type {BOCspPageInterface} from '@interfaces/BO/advancedParameters/security/csp/index';

/* eslint-disable global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
function requirePage(): BOCspPageInterface {
  return require('@versions/develop/pages/BO/advancedParameters/security/csp/index');
}

/* eslint-enable global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

export default requirePage();
