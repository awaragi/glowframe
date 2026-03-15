import { MODE_DEFAULTS } from '@/lib/modeDefaults'

describe('MODE_DEFAULTS', () => {
  it('has an entry for all six modes', () => {
    expect(Object.keys(MODE_DEFAULTS)).toEqual([
      'full',
      'full-color',
      'ring',
      'ring-color',
      'spot',
      'spot-color',
    ])
  })

  describe('full', () => {
    it('has mode discriminant "full"', () => {
      expect(MODE_DEFAULTS['full'].mode).toBe('full')
    })
    it('has lightTemperature 6500', () => {
      expect(MODE_DEFAULTS['full'].lightTemperature).toBe(6500)
    })
    it('has lightBrightness 100', () => {
      expect(MODE_DEFAULTS['full'].lightBrightness).toBe(100)
    })
  })

  describe('full-color', () => {
    it('has mode discriminant "full-color"', () => {
      expect(MODE_DEFAULTS['full-color'].mode).toBe('full-color')
    })
    it('has lightColor "#ffffff"', () => {
      expect(MODE_DEFAULTS['full-color'].lightColor).toBe('#ffffff')
    })
  })

  describe('ring', () => {
    it('has mode discriminant "ring"', () => {
      expect(MODE_DEFAULTS['ring'].mode).toBe('ring')
    })
    it('has lightTemperature 6500', () => {
      expect(MODE_DEFAULTS['ring'].lightTemperature).toBe(6500)
    })
    it('has lightBrightness 100', () => {
      expect(MODE_DEFAULTS['ring'].lightBrightness).toBe(100)
    })
    it('has innerRadius 20', () => {
      expect(MODE_DEFAULTS['ring'].innerRadius).toBe(20)
    })
    it('has outerRadius 80', () => {
      expect(MODE_DEFAULTS['ring'].outerRadius).toBe(80)
    })
    it('has backgroundLightTemperature 0', () => {
      expect(MODE_DEFAULTS['ring'].backgroundLightTemperature).toBe(0)
    })
    it('has backgroundLightBrightness 0', () => {
      expect(MODE_DEFAULTS['ring'].backgroundLightBrightness).toBe(0)
    })
  })

  describe('ring-color', () => {
    it('has mode discriminant "ring-color"', () => {
      expect(MODE_DEFAULTS['ring-color'].mode).toBe('ring-color')
    })
    it('has lightColor "#ffffff"', () => {
      expect(MODE_DEFAULTS['ring-color'].lightColor).toBe('#ffffff')
    })
    it('has innerRadius 20', () => {
      expect(MODE_DEFAULTS['ring-color'].innerRadius).toBe(20)
    })
    it('has outerRadius 80', () => {
      expect(MODE_DEFAULTS['ring-color'].outerRadius).toBe(80)
    })
    it('has backgroundColor "#000000"', () => {
      expect(MODE_DEFAULTS['ring-color'].backgroundColor).toBe('#000000')
    })
  })

  describe('spot', () => {
    it('has mode discriminant "spot"', () => {
      expect(MODE_DEFAULTS['spot'].mode).toBe('spot')
    })
    it('has lightTemperature 6500', () => {
      expect(MODE_DEFAULTS['spot'].lightTemperature).toBe(6500)
    })
    it('has lightBrightness 100', () => {
      expect(MODE_DEFAULTS['spot'].lightBrightness).toBe(100)
    })
    it('has radius 40', () => {
      expect(MODE_DEFAULTS['spot'].radius).toBe(40)
    })
    it('has backgroundLightTemperature 0', () => {
      expect(MODE_DEFAULTS['spot'].backgroundLightTemperature).toBe(0)
    })
    it('has backgroundLightBrightness 0', () => {
      expect(MODE_DEFAULTS['spot'].backgroundLightBrightness).toBe(0)
    })
  })

  describe('spot-color', () => {
    it('has mode discriminant "spot-color"', () => {
      expect(MODE_DEFAULTS['spot-color'].mode).toBe('spot-color')
    })
    it('has lightColor "#ffffff"', () => {
      expect(MODE_DEFAULTS['spot-color'].lightColor).toBe('#ffffff')
    })
    it('has radius 40', () => {
      expect(MODE_DEFAULTS['spot-color'].radius).toBe(40)
    })
    it('has backgroundColor "#000000"', () => {
      expect(MODE_DEFAULTS['spot-color'].backgroundColor).toBe('#000000')
    })
  })
})
