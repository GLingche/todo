<template>
<uni-shadow-root class="calendar-index"><view class="flex b tb ac" v-if="calendar">
  <view class="calendar b tb">
    
    <view v-if="(!calendarConfig.hideHeadOnWeekMode)" :class="'handle '+(calendarConfig.theme)+'_handle-color fs28 b lr ac pc'">
      <view class="prev fs36" v-if="calendarConfig.showHandlerOnWeekMode || !calendarConfig.weekMode">
        <text class="prev-handle iconfont icon-doubleleft" @click="chooseDate" data-type="prev_year"></text>
        <text class="prev-handle iconfont icon-left" @click="chooseDate" data-type="prev_month"></text>
      </view>
      <view class="flex date-in-handle b lr cc" @click="doubleClickToToday">{{calendar.curYear || "--"}} 年 {{calendar.curMonth || "--"}} 月</view>
      <view class="next fs36" v-if="calendarConfig.showHandlerOnWeekMode || !calendarConfig.weekMode">
        <text class="next-handle iconfont icon-right" @click="chooseDate" data-type="next_month"></text>
        <text class="next-handle iconfont icon-doubleright" @click="chooseDate" data-type="next_year"></text>
      </view>
    </view>
    
    <view :class="'weeks b lr ac '+(calendarConfig.theme)+'_week-color'">
      <view v-for="(item,index) in (calendar.weeksCh)" :key="item.index" class="week fs28" :data-idx="index">{{item}}</view>
    </view>
    
    <view class="b lr wrap" @touchstart="calendarTouchstart" @touchmove.stop.prevent="calendarTouchmove" @touchend.stop.prevent="calendarTouchend">
        
        <view v-for="(item,index) in (calendar.empytGrids)" :key="item.index" :class="'grid b ac pc '+(calendarConfig.theme)+'_prev-month-date'" v-if="calendar.empytGrids" :data-idx="index">
            <view class="date-wrap b cc">
              <view class="date">
                {{item.day}}
                <view v-if="calendarConfig.showLunar && item.lunar" class="date-desc date-desc-bottom">
                    {{item.lunar.Term || item.lunar.IDayCn}}
                </view>
              </view>
            </view>
        </view>
        
        <view v-for="(item,index) in (calendar.days)" :key="item.index" :data-idx="index" :data-date="item" @click="tapDayItem" :class="'grid '+(item.class ? item.class  : '')+' '+(calendarConfig.theme)+'_normal-date b ac pc'">
            <view :class="'date-wrap b cc '+((item.week === 0 || item.week === 6) ? calendarConfig.theme + '_weekend-color' : '')">
              <view :class="'date b ac pc '+(item.class ? item.class  : '')+' '+(calendarConfig.chooseAreaMode ? 'date-area-mode' : '')+' '+(calendar.todoLabelCircle && item.showTodoLabel && !item.choosed ? calendarConfig.theme + '_todo-circle todo-circle' : '')+' '+(item.isToday ? calendarConfig.theme + '_today' : '')+' '+(item.choosed ? calendarConfig.theme + '_choosed' : '')+' '+(item.disable ? calendarConfig.theme + '_date-disable' : '')">
                {{calendarConfig.markToday && item.isToday ? calendarConfig.markToday : item.day}}
                <view v-if="(calendarConfig.showLunar && item.lunar && !item.showTodoLabel) || (item.showTodoLabel && calendar.todoLabelPos !== 'bottom')" :class="'date-desc '+(calendarConfig.theme)+'_date-desc date-desc-bottom '+((item.choosed || item.isToday) ? 'date-desc-bottom-always' : '')+' '+(item.disable ? calendarConfig.theme + '_date-desc-disable' : '')">
                  {{item.lunar.Term || item.lunar.IDayCn}}
                </view>
                <view v-if="item.showTodoLabel && !calendar.todoLabelCircle" :class="(item.todoText ? 'date-desc' : calendarConfig.theme + '_todo-dot todo-dot')+' '+(calendarConfig.showLunar ? calendarConfig.theme + '_date-desc-lunar' : '')+' '+(calendar.todoLabelPos === 'bottom' ? 'date-desc-bottom todo-dot-bottom' : 'date-desc-top todo-dot-top')+' '+(calendar.showLabelAlways && item.choosed && calendar.todoLabelPos === 'bottom' ? 'date-desc-bottom-always todo-dot-bottom-always' : '')+' '+(calendar.showLabelAlways && item.choosed && calendar.todoLabelPos === 'top' ? 'date-desc-top-always todo-dot-top-always' : '')" :style="'background-color: '+(item.todoText ? '' : item.color || calendar.todoLabelColor)+'; color: '+(item.color)">
                    {{item.todoText}}
                </view>
              </view>
            </view>
        </view>
        
        <view v-for="(item,index) in (calendar.lastEmptyGrids)" :key="item.index" :class="'grid b ac pc '+(calendarConfig.theme)+'_next-month-date'" :data-idx="index">
          <view class="date-wrap b cc">
            <view class="date">
              {{item.day}}
              <view v-if="calendarConfig.showLunar && item.lunar" class="date-desc date-desc-bottom">
                  {{item.lunar.Term || item.lunar.IDayCn}}
              </view>
            </view>
          </view>
        </view>
      </view>
  </view>
</view></uni-shadow-root>
</template>

<script>

global['__wxRoute'] = 'calendar/index'
import Week from './func/week'
import { Logger, Slide, GetDate, initialTasks } from './func/utils'
import initCalendar, {
  jump,
  getCurrentYM,
  whenChangeDate,
  renderCalendar,
  whenMulitSelect,
  whenSingleSelect,
  whenChooseArea,
  getCalendarDates
} from './main.js'

// // 引入插件安装器
// import plugin from '../v2/plugins/index.js'

// // 设置代办
// import todo from '../v2/plugins/todo.js'
// plugin.use(todo)



const slide = new Slide()
const logger = new Logger()
const getDate = new GetDate()

Component({
  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    calendarConfig: {
      type: Object,
      value: {}
    }
  },
  data: {
    handleMap: {
      prev_year: 'chooseYear',
      prev_month: 'chooseMonth',
      next_month: 'chooseMonth',
      next_year: 'chooseYear'
    }
  },
  lifetimes: {
    attached: function() {
      this.initComp()
    },
    detached: function() {
      initialTasks.flag = 'finished'
      initialTasks.tasks.length = 0
    }
  },
  methods: {
    initComp() {
      const calendarConfig = this.setDefaultDisableDate()
      this.setConfig(calendarConfig)
    },
    setDefaultDisableDate() {
      const calendarConfig = this.properties.calendarConfig || {}
      if (calendarConfig.disableMode && !calendarConfig.disableMode.date) {
        calendarConfig.disableMode.date = getDate.toTimeStr(getDate.todayDate())
      }
      return calendarConfig
    },
    setConfig(config) {
      if (config.markToday && typeof config.markToday === 'string') {
        config.highlightToday = true
      }
      config.theme = config.theme || 'default'
      this.weekMode = config.weekMode
      this.setData(
        {
          calendarConfig: config
        },
        () => {
          initCalendar(this, config)
        }
      )
    },
    chooseDate(e) {
      const { type } = e.currentTarget.dataset
      if (!type) return
      const methodName = this.data.handleMap[type]
      this[methodName](type)
    },
    chooseYear(type) {
      const { curYear, curMonth } = this.data.calendar
      if (!curYear || !curMonth) return logger.warn('异常：未获取到当前年月')
      if (this.weekMode) {
        return console.warn('周视图下不支持点击切换年月')
      }
      let newYear = +curYear
      let newMonth = +curMonth
      if (type === 'prev_year') {
        newYear -= 1
      } else if (type === 'next_year') {
        newYear += 1
      }
      this.render(curYear, curMonth, newYear, newMonth)
    },
    chooseMonth(type) {
      const { curYear, curMonth } = this.data.calendar
      if (!curYear || !curMonth) return logger.warn('异常：未获取到当前年月')
      if (this.weekMode) return console.warn('周视图下不支持点击切换年月')
      let newYear = +curYear
      let newMonth = +curMonth
      if (type === 'prev_month') {
        newMonth = newMonth - 1
        if (newMonth < 1) {
          newYear -= 1
          newMonth = 12
        }
      } else if (type === 'next_month') {
        newMonth += 1
        if (newMonth > 12) {
          newYear += 1
          newMonth = 1
        }
      }
      this.render(curYear, curMonth, newYear, newMonth)
    },
    render(curYear, curMonth, newYear, newMonth) {
      whenChangeDate.call(this, {
        curYear,
        curMonth,
        newYear,
        newMonth
      })
      this.setData({
        'calendar.curYear': newYear,
        'calendar.curMonth': newMonth
      })
      renderCalendar.call(this, newYear, newMonth)
    },
    /**
     * 日期点击事件
     * @param {!object} e 事件对象
     */
    tapDayItem(e) {
      const { idx, date = {} } = e.currentTarget.dataset
      const { day, disable } = date
      if (disable || !day) return
      const config = this.data.calendarConfig || this.config || {}
      const { multi, chooseAreaMode } = config
      if (multi) {
        whenMulitSelect.call(this, idx)
      } else if (chooseAreaMode) {
        whenChooseArea.call(this, idx)
      } else {
        whenSingleSelect.call(this, idx)
      }
      this.setData({
        'calendar.noDefault': false
      })
    },
    doubleClickToToday() {
      if (this.config.multi || this.weekMode) return
      if (this.count === undefined) {
        this.count = 1
      } else {
        this.count += 1
      }
      if (this.lastClick) {
        const difference = new Date().getTime() - this.lastClick
        if (difference < 500 && this.count >= 2) {
          jump.call(this)
        }
        this.count = undefined
        this.lastClick = undefined
      } else {
        this.lastClick = new Date().getTime()
      }
    },
    /**
     * 日历滑动开始
     * @param {object} e
     */
    calendarTouchstart(e) {
      const t = e.touches[0]
      const startX = t.clientX
      const startY = t.clientY
      this.slideLock = true // 滑动事件加锁
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
      const { preventSwipe } = this.properties.calendarConfig
      if (!this.slideLock || preventSwipe) return
      if (slide.isLeft(gesture, e.touches[0])) {
        this.handleSwipe('left')
        this.slideLock = false
      }
      if (slide.isRight(gesture, e.touches[0])) {
        this.handleSwipe('right')
        this.slideLock = false
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
      let swipeCalendarType = 'next_month'
      let weekChangeType = 'next_week'
      if (direction === 'right') {
        swipeKey = 'calendar.rightSwipe'
        swipeCalendarType = 'prev_month'
        weekChangeType = 'prev_week'
      }
      this.setData({
        [swipeKey]: 1
      })
      this.currentYM = getCurrentYM()
      if (this.weekMode) {
        this.slideLock = false
        this.currentDates = getCalendarDates()
        if (weekChangeType === 'prev_week') {
          Week(this).calculatePrevWeekDays()
        } else if (weekChangeType === 'next_week') {
          Week(this).calculateNextWeekDays()
        }
        this.onSwipeCalendar(weekChangeType)
        this.onWeekChange(weekChangeType)
        return
      }
      this.chooseMonth(swipeCalendarType)
      this.onSwipeCalendar(swipeCalendarType)
    },
    onSwipeCalendar(direction) {
      this.triggerEvent('onSwipe', {
        directionType: direction,
        currentYM: this.currentYM
      })
    },
    onWeekChange(direction) {
      this.triggerEvent('whenChangeWeek', {
        current: {
          currentYM: this.currentYM,
          dates: [...this.currentDates]
        },
        next: {
          currentYM: getCurrentYM(),
          dates: getCalendarDates()
        },
        directionType: direction
      })
      this.currentDates = null
      this.currentYM = null
    }
  }
})
export default global['__wxComponents']['calendar/index']
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