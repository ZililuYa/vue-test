import { expect } from 'chai'
import { shallow } from '@vue/test-utils'
import SwitchSystem from '@/components/main/components/switch-system'

describe('SwitchSystem', () => {
  it('renders props.platform when passed', () => {
    const platform = []
    const wrapper = shallow(SwitchSystem, {
      propsData: { platform }
    })
    expect(wrapper.text()).to.include(platform)
  })
})
