import { VM } from './lib/vm/vm'
import { Dialog } from './lib/dialog/dialog'
import { MockService } from './service/mock.service'

require('./css/main.styl')
require('./lib/dialog/dialog.styl')
require('../assets/fonticons/fonts.css')

const dialog = ((window as any).dialog = new Dialog())
const mockService = new MockService()
const mockData = mockService.getCruiseTestData()
new VM({
    el: document.querySelector('#app'),
    data: mockData,
    computed: {},
    methods: {
        addTag: (e: MouseEvent, agentItem: any) => {
            const { layerX, layerY } = e
            dialog.createDialog(
                { layerX, layerY },
                {
                    title: 'Separate multiple name with commas',
                    confirm: 'Add Resources',
                    cancel: 'Cancel'
                }
            )
        },
        deny: (e: MouseEvent, agentItem: any) => {
            if (Math.random() > 0.5) {
                agentItem.status = 'building'
            } else {
                agentItem.status = (Math.random() * 10000).toFixed(2)
            }
            // agentItem.status = (Math.random() * 10000).toFixed(2)
        }
    }
})
