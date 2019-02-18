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
            const { pageX, pageY } = e
            dialog.createDialog(
                { pageX, pageY },
                {
                    title: 'Separate multiple name with commas',
                    confirm: 'Add Resources',
                    cancel: 'Cancel',
                    methods: {
                        confirm(title: string): void {
                            if (title) {
                                agentItem.tags.push({ title })
                            }
                        }
                    }
                }
            )
        },
        deny: (e: MouseEvent, agentItem: any) => {},
        removeTag(this: any, e: MouseEvent, agentItem: any): void {
            if (this.parent) {
                const tags = this.parent.data.item.tags
                const index = tags.indexOf(agentItem)
                tags.splice(index, 1)
            }
        }
    }
})
