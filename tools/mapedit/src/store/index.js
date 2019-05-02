import level from './modules/level';
import editor from './modules/editor';
import renderBlockPlugin from './plugins/renderBlockPlugin';
import ioPlugin from './plugins/ioPlugin';

export default {
    modules: {
        level,
        editor
    },
    plugins: [renderBlockPlugin, ioPlugin]
};
