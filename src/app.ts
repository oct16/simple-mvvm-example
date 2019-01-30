import { VM } from './lib/vm/vm';
import { mockData } from './mock-data';
import { Dialog } from './lib/dialog/dialog';

require('./css/main.styl');
require('./lib/dialog/dialog.styl');
require('../assets/fonticons/fonts.css');

new VM({
    el: document.querySelector('#app'),
    data: mockData,
    computed: {
        name: () => {
            return 'this is computed data';
        }
    },
    methods: {
        addTag: (e: MouseEvent, agentItem: any) => {
            agentItem.title = 123;
            const { clientX, clientY } = e;
            new Dialog({
                clientX,
                clientY
            });
        },
        deny: (agentItem: any) => {}
    }
});
