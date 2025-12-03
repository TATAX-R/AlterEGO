import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const darkPalette = ['hsla(77, 40%, 1%, 1)','hsla(77, 33%, 10%, 1)','hsla(78, 25%, 19%, 1)','hsla(78, 18%, 28%, 1)','hsla(79, 10%, 37%, 1)','hsla(77, 10%, 37%, 1)','hsla(64, 8%, 47%, 1)','hsla(52, 7%, 58%, 1)','hsla(39, 5%, 68%, 1)','hsla(26, 3%, 78%, 1)','hsla(13, 2%, 89%, 1)','hsla(0, 0%, 99%, 1)']
const lightPalette = ['hsla(77, 40%, 60%, 1)','hsla(77, 44%, 65%, 1)','hsla(77, 48%, 71%, 1)','hsla(77, 52%, 76%, 1)','hsla(77, 57%, 82%, 1)','hsla(77, 0%, 100%, 1)','hsla(64, 0%, 100%, 1)','hsla(52, 0%, 100%, 1)','hsla(39, 0%, 100%, 1)','hsla(26, 0%, 100%, 1)','hsla(13, 0%, 100%, 1)','hsla(0, 0%, 100%, 1)']

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

// we're adding some example sub-themes for you to show how they are done, "success" "warning", "error":

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: ['hsla(38, 99%, 35%, 1)','hsla(37, 88%, 42%, 1)','hsla(36, 78%, 49%, 1)','hsla(34, 68%, 56%, 1)','hsla(33, 58%, 63%, 1)','hsla(31, 44%, 72%, 1)','hsla(22, 30%, 80%, 1)','hsla(12, 15%, 87%, 1)','hsla(12, 15%, 87%, 1)','hsla(0, 0%, 95%, 1)','hsla(0, 0%, 95%, 1)','hsla(0, 0%, 95%, 1)'],
      light: ['hsla(38, 99%, 70%, 1)','hsla(35, 98%, 70%, 1)','hsla(32, 98%, 70%, 1)','hsla(28, 98%, 70%, 1)','hsla(25, 97%, 70%, 1)','hsla(0, 0%, 100%, 1)','hsla(0, 0%, 100%, 1)','hsla(0, 0%, 100%, 1)','hsla(22, 97%, 71%, 1)','hsla(0, 0%, 100%, 1)','hsla(0, 0%, 100%, 1)','hsla(0, 0%, 100%, 1)'],
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },

  // optionally add more, can pass palette or template

  // grandChildrenThemes: {
  //   alt1: {
  //     template: 'alt1',
  //   },
  //   alt2: {
  //     template: 'alt2',
  //   },
  //   surface1: {
  //     template: 'surface1',
  //   },
  //   surface2: {
  //     template: 'surface2',
  //   },
  //   surface3: {
  //     template: 'surface3',
  //   },
  // },
})

export type Themes = typeof builtThemes

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' &&
  process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)
