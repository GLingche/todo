<template>
<uni-shadow-root class="v2-index"><view class="flex b tb ac" v-if="calendar">
  <view class="calendar b tb">
    
    <view v-if="(!config.hideHeader)" :class="'handle '+(config.theme)+'_handle-color fs28 b lr ac pc'">
      <view class="prev fs36" v-if="(!config.weekMode)">
        <text class="prev-handle iconfont icon-doubleleft" @click="changeDate" data-type="prev_year"></text>
        <text class="prev-handle iconfont icon-left" @click="changeDate" data-type="prev_month"></text>
      </view>
      <view class="flex date-in-handle b lr cc" @click="doubleClickJumpToToday">{{calendar.curYear || "--"}} 年 {{calendar.curMonth || "--"}} 月</view>
      <view class="next fs36" v-if="(!config.weekMode)">
        <text class="next-handle iconfont icon-right" @click="changeDate" data-type="next_month"></text>
        <text class="next-handle iconfont icon-doubleright" @click="changeDate" data-type="next_year"></text>
      </view>
    </view>
    
    <view :class="'weeks b lr ac '+(config.theme)+'_week-color'">
      <view v-for="(item,index) in (calendar.weeksCh)" :key="item.index" class="week fs28" :data-idx="index">{{item}}</view>
    </view>
    
    <view class="b lr wrap" @touchstart="calendarTouchstart" @touchmove.stop.prevent="calendarTouchmove" @touchend.stop.prevent="calendarTouchend">
      
      <view v-for="(item,index) in (calendar.prevMonthGrids)" :key="item.index" :class="'grid b ac pc '+(config.theme)+'_prev-month-date'" :data-idx="index">
        <view class="date-wrap b cc">
          <view class="date">
                {{item.date}}
          </view>
        </view>
      </view>
      
      <view v-for="(item,index) in (calendar.dates)" :key="item.index" :data-idx="index" :data-info="item" @click="tapDate" :class="'grid '+(item.class ? item.class  : '')+' '+(config.theme)+'_normal-date b ac pc'">
        <view :class="'date-wrap b cc '+(config.emphasisWeek && (item.week === 0 || item.week === 6) ? config.theme + '_weekend-color' : '')">
          <view :class="'date b ac pc '+(item.class ? item.class  : '')+' '+(item.isToday && config.highlightToday ? config.theme + '_today' : '')+' '+(item.choosed ? config.theme + '_choosed' : '')+' '+(item.disable ? config.theme + '_date-disable' : '')+' '+(config.chooseAreaMode ? 'date-area-mode' : '')+'  '+(calendar.todoLabelCircle && item.showTodoLabel && !item.choosed ? config.theme + '_todo-circle todo-circle' : '')">
                {{config.markToday && item.isToday ? config.markToday : item.date}}
                <view v-if="(config.showLunar && item.lunar && !item.showTodoLabel) || (item.showTodoLabel && calendar.todoLabelPos !== 'bottom') || config.showHolidays" :class="'date-desc '+(config.theme)+'_date-desc date-desc-bottom '+((item.choosed || item.isToday) ? 'date-desc-bottom-always' : '')+' '+(item.disable ? config.theme + '_date-desc-disable' : '')">
                  <text :class="(config.showHolidays && !item.showTodoLabel && item.label && !item.choosed ? config.theme + '_date-desc-lunar' : '')+' '+(item.type === 'festival' ? config.theme + '_festival' : '')">{{item.label || item.lunar.Term || item.lunar.IDayCn}}</text>
                </view>
                <view v-if="item.showTodoLabel && !calendar.todoLabelCircle" :class="(item.todoText ? 'date-desc' : config.theme + '_todo-dot todo-dot')+' '+(config.showLunar ? config.theme + '_date-desc-lunar' : '')+' '+(calendar.todoLabelPos === 'bottom' ? 'date-desc-bottom todo-dot-bottom' : 'date-desc-top todo-dot-top')+' '+(calendar.showLabelAlways && item.choosed && calendar.todoLabelPos === 'bottom' ? 'date-desc-bottom-always todo-dot-bottom-always' : '')+' '+(calendar.showLabelAlways && item.choosed && calendar.todoLabelPos === 'top' ? 'date-desc-top-always todo-dot-top-always' : '')" :style="'background-color: '+(item.todoText ? '' : item.color || calendar.todoLabelColor)+'; color: '+(item.color)">
                    {{item.todoText}}
                </view>
          </view>
        </view>
      </view>
      
      <view v-for="(item,index) in (calendar.nextMonthGrids)" :key="item.index" :class="'grid b ac pc '+(config.theme)+'_next-month-date'" :data-idx="index">
        <view class="date-wrap b cc">
          <view class="date">
              {{item.date}}
          </view>
        </view>
      </view>
    </view>
  </view>
</view></uni-shadow-root>
</template>

<script>

global['__wxRoute'] = 'v2/index'
import plugins from './plugins/index'
import { calcJumpData } from './core'
import { renderCalendar } from './render'
import { calcTargetYMInfo } from './helper'
import { dateUtil, calendarGesture, logger } from './utils/index'

Component({
  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    config: {
      type: Object,
      value: {}
    }
  },
  lifetimes: {
    attached: function() {
      this.initComp()
    }
  },
  methods: {
    initComp() {
      const calendarConfig = this.setDefaultDisableDate()
      this.setConfig(calendarConfig)
    },
    // 禁用某天日期配置默认为今天
    setDefaultDisableDate() {
      const calendarConfig = this.properties.config || {}
      if (calendarConfig.disableMode && !calendarConfig.disableMode.date) {
        calendarConfig.disableMode.date = dateUtil.toTimeStr(
          dateUtil.todayFMD()
        )
      }
      return calendarConfig
    },
    initCalendar(config) {
      const { defaultDate } = config
      let date = dateUtil.todayFMD()
      if (defaultDate && typeof defaultDate === 'string') {
        const dateInfo = defaultDate.split('-')
        if (dateInfo.length < 3) {
          return logger.warn('defaultDate配置格式应为: 2018-4-2 或 2018-04-02')
        } else {
          date = {
            year: +dateInfo[0],
            month: +dateInfo[1],
            date: +dateInfo[2]
          }
        }
      }
      const waitRenderData = calcJumpData({
        dateInfo: date,
        config
      })
      const timestamp = dateUtil.todayTimestamp()
      if (config.autoChoosedWhenJump) {
        const target = waitRenderData.dates.filter(
          item => dateUtil.toTimeStr(item) === dateUtil.toTimeStr(date)
        )
        if (target && target.length) {
          if (!waitRenderData.selectedDates) {
            waitRenderData.selectedDates = target
          } else {
            waitRenderData.selectedDates.push(target[0])
          }
        }
      }
      return {
        ...waitRenderData,
        todayTimestamp: timestamp,
        weeksCh: dateUtil.getWeekHeader(config.firstDayOfWeek)
      }
    },
    setConfig(config) {
      if (config.markToday && typeof config.markToday === 'string') {
        config.highlightToday = true
      }
      config.theme = config.theme || 'default'
      this.setData(
        {
          config
        },
        () => {
          for (let plugin of plugins.installed) {
            const [, p] = plugin
            if (typeof p.install === 'function') {
              p.install(this)
            }
            if (typeof p.methods === 'function') {
              const methods = p.methods(this)
              for (let fnName in methods) {
                if (fnName.startsWith('__')) continue
                const fn = methods[fnName]
                if (typeof fn === 'function') {
                  if (!this.calendar) this.calendar = {}
                  this.calendar[fnName] = fn
                }
              }
            }
          }
          const initData = this.initCalendar(config)
          renderCalendar.call(this, initData, config)
        }
      )
    },
    tapDate(e) {
      const { info } = e.currentTarget.dataset
      const { date, disable } = info || {}
      if (disable || !date) return
      const { calendar, config } = this.data
      let calendarData = calendar
      let calendarConfig = config
      if (config.takeoverTap) {
        return this.triggerEvent('takeoverTap', info)
      }
      for (let plugin of plugins.installed) {
        const [, p] = plugin
        if (typeof p.onTapDate === 'function') {
          const {
            calendarData: __calendarData,
            calendarConfig: __calendarConfig
          } = p.onTapDate(info, calendarData, calendarConfig)
          calendarData = __calendarData
          calendarConfig = __calendarConfig
        }
      }
      renderCalendar.call(this, calendarData, calendarConfig).then(() => {
        this.triggerEvent('afterTapDate', info)
      })
    },
    /**
     * 日历滑动开始
     * @param {object} e
     */
    calendarTouchstart(e) {
      const t = e.touches[0]
      const startX = t.clientX
      const startY = t.clientY
      this.swipeLock = true
      this.setData({
        'gesture.startX': startX,
        'gesture.startY': startY
      })
    },
    /**
     * 日历滑动中
     * @param {object} e
     */
    calendarTouchmove(e) {
      const { gesture } = this.data
      const { preventSwipe } = this.properties.config
      if (!this.swipeLock || preventSwipe) return
      if (calendarGesture.isLeft(gesture, e.touches[0])) {
        this.handleSwipe('left')
        this.swipeLock = false
      }
      if (calendarGesture.isRight(gesture, e.touches[0])) {
        this.handleSwipe('right')
        this.swipeLock = false
      }
    },
    calendarTouchend(e) {
      this.setData({
        'calendar.leftSwipe': 0,
        'calendar.rightSwipe': 0
      })
    },
    handleSwipe(direction) {
      let swipeKey = 'calendar.leftSwipe'
      if (direction === 'right') {
        swipeKey = 'calendar.rightSwipe'
      }
      this.setData({
        [swipeKey]: 1
      })
      const { calendar } = this.data
      let calendarData = calendar
      const { curYear, curMonth } = calendarData
      const getMonthInfo = calcTargetYMInfo()[direction]
      const target = getMonthInfo({
        year: +curYear,
        month: +curMonth
      })
      target.direction = direction
      this.renderCalendar(target)
    },
    changeDate(e) {
      const { type } = e.currentTarget.dataset
      const { calendar: calendarData } = this.data
      const { curYear, curMonth } = calendarData
      const getMonthInfo = calcTargetYMInfo()[type]
      const target = getMonthInfo({
        year: +curYear,
        month: +curMonth
      })
      target.direction = type
      this.renderCalendar(target)
    },
    renderCalendar(target) {
      let { calendar: calendarData, config } = this.data
      const { curYear, curMonth } = calendarData || {}
      for (let plugin of plugins.installed) {
        const [, p] = plugin
        if (typeof p.onSwitchCalendar === 'function') {
          calendarData = p.onSwitchCalendar(target, calendarData, this)
        }
      }
      return renderCalendar.call(this, calendarData, config).then(() => {
        let triggerEventName = 'whenChangeMonth'
        if (config.weekMode) {
          triggerEventName = 'whenChangeWeek'
        }
        this.triggerEvent(triggerEventName, {
          current: {
            year: +curYear,
            month: +curMonth
          },
          next: target
        })
        this.triggerEvent('onSwipe', {
          current: {
            year: +curYear,
            month: +curMonth
          },
          next: target,
          type: triggerEventName
        })
      })
    },
    doubleClickJumpToToday() {
      const { multi, weekMode } = this.calendar.getCalendarConfig() || {}
      if (multi || weekMode) return
      if (this.count === undefined) {
        this.count = 1
      } else {
        this.count += 1
      }
      if (this.lastClick) {
        const difference = new Date().getTime() - this.lastClick
        if (
          difference < 500 &&
          this.count >= 2 &&
          typeof this.calendar.jump === 'function'
        ) {
          const today = dateUtil.todayFMD()
          this.calendar.jump(today)
        }
        this.count = undefined
        this.lastClick = undefined
      } else {
        this.lastClick = new Date().getTime()
      }
    }
  }
})
export default global['__wxComponents']['v2/index']
</script>
<style platform="mp-weixin">
@import './theme/iconfont.css';
@import './theme/theme-default.css';
@import './theme/theme-elegant.css';

.b {
    display: flex;
}

.lr {
    flex-direction: row;
}

.tb {
    flex-direction: column;
}

.pc {
    justify-content: center;
}

.ac {
    align-items: center;
}

.cc {
    align-items: center;
    justify-content: center;
}

.wrap {
    flex-wrap: wrap;
}

.flex {
    flex-grow: 1;
}

.bg {
    background-image: linear-gradient(to bottom, #faefe7, #ffcbd7);
    overflow: hidden;
}

.white-color {
    color: #fff;
}

.fs24 {
    font-size: 24rpx;
}

.fs28 {
    font-size: 28rpx;
}

.fs32 {
    font-size: 32rpx;
}

.fs36 {
    font-size: 36rpx;
}

.calendar {
    width: 100%;
    box-sizing: border-box;
}

/* 日历操作栏 */

.handle {
    height: 80rpx;
}

.prev-handle,
.next-handle {
    padding: 20rpx;
}

.date-in-handle {
    height: 80rpx;
}

/* 星期栏 */

.weeks {
    height: 50rpx;
    line-height: 50rpx;
    opacity: 0.5;
}

.week {
    text-align: center;
}

.grid,
.week {
    width: 14.286014285714286%;
}

.date-wrap {
    width: 100%;
    height: 80rpx;
    position: relative;
    left: 0;
    top: 0;
}

.date {
    position: relative;
    left: 0;
    top: 0;
    width: 55rpx;
    height: 55rpx;
    text-align: center;
    line-height: 55rpx;
    font-size: 26rpx;
    font-weight: 200;
    border-radius: 50%;
    transition: all 0.3s;
    animation-name: choosed;
    animation-duration: 0.5s;
    animation-timing-function: linear;
    animation-iteration-count: 1;
}

.date-area-mode {
    width: 100%;
    border-radius: 0;
}

.date-desc {
    width: 150%;
    height: 32rpx;
    font-size: 20rpx;
    line-height: 32rpx;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-line-clamp: 1;
    text-align: center;
}

@keyframes choosed {
    from {
        transform: scale(1);
    }

    50% {
        transform: scale(0.9);
    }

    to {
        transform: scale(1);
    }
}

/* 日期圆圈标记 */
.todo-circle {
    border-width: 1rpx;
    border-style: solid;
    box-sizing: border-box;
}

/* 待办点标记相关样式 */
.todo-dot {
    width: 10rpx;
    height: 10rpx;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.todo-dot-top {
    top: 3rpx;
}

.todo-dot.todo-dot-top-always {
    top: -8rpx;
}

.todo-dot.todo-dot-bottom {
    bottom: 0;
}

.todo-dot.todo-dot-bottom-always {
    bottom: -10rpx;
}

/* 日期描述文字（待办文字/农历）相关样式 */

.date-desc.date-desc-top {
    top: -6rpx;
}

.date-desc.date-desc-top-always {
    top: -20rpx;
}

.date-desc.date-desc-bottom {
    bottom: -14rpx;
}

.todo-circle .date-desc.date-desc-bottom {
    bottom: -30rpx;
}

.date-desc.date-desc-bottom-always {
    bottom: -28rpx;
}
</style>