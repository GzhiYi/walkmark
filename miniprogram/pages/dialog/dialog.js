Component({
  options: {
    multipleSlots: true
  },
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },
  data: {
  },
  ready() {
  },
  attached() {
    console.log('this', this.data.visible)
  },
  methods: {
  }
})