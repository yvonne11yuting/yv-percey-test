/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sass from 'rollup-plugin-sass';
import image from '@rollup/plugin-image';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import cssnano from 'cssnano';
import filesize from 'rollup-plugin-filesize';
import alias from '@rollup/plugin-alias';
import conditional from 'rollup-plugin-conditional';

const isDev = process.env.NODE_ENV === 'development';
const input = './src/index';

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
};

export default [{
  input,
  output: [
    {
      file: './libs/calendar_datepicker.js',
      format: 'es',
      name: 'calendar_datepicker',
      globals,
    },
  ],
  plugins: [
    alias({
      entries: {
        '@': path.resolve(__dirname, './src'),
      },
    }),
    resolve({
      extensions: ['.js', '.jsx'],
    }),
    peerDepsExternal(),
    commonjs(),
    babel({
      runtimeHelpers: true,
      exclude: ['node_modules/**'],
    }),
    sass({
      insert: true,
      processor: (css) => postcss([
        autoprefixer({ grid: 'autoplace' }),
        cssnano,
      ]).process(css, { from: undefined }).then((result) => result.css),
    }),
    image(),
    filesize(),
    conditional(!isDev, [terser()]),
  ],
  external: ['react', 'react-dom'],
}];
