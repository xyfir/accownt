import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme(
  !Array.isArray(process.enve.THEME)
    ? process.enve.THEME
    : localStorage.getItem(process.enve.THEME_TYPE_KEY) == 'dark'
    ? process.enve.THEME[1]
    : process.enve.THEME[0]
);
