import level from './modules/level';
import editor from './modules/editor';
import renderBlockPlugin from './plugins/renderBlockPlugin';

export default {
    modules: {
        level,
        editor
    },
    plugins: [renderBlockPlugin]
};
