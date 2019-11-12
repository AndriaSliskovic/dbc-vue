import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/layer/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const title = true
    const wrapper = shallowMount(HelloWorld, {
      propsData: { title }
    })
     expect(wrapper.text()).toBe(title);
    expect(wrapper.text()).toMatch("true")
  })
})