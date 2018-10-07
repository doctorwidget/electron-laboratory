/**
 * Action constant strings and action creator functions for the alpha page
 */

export const ALPHA_ACTIVATE = 'ALPHA_ACTIVATE';
export const ALPHA_DEACTIVATE = 'ALPHA_DEACTIVATE';

export function alphaActivate() {
  return {
    type: ALPHA_ACTIVATE
  };
}

export function alphaDeactivate() {
  return {
    type: ALPHA_DEACTIVATE
  };
}
