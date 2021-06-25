/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import LOCALES from '@/locales';
import {
  dateToAry,
  dateToObj,
  dateToStr,
  isValidDate,
} from '@/utils';
import Iconleft from '@/assets/icon_arrow_left.svg';
import IconRight from '@/assets/icon_arrow_right.svg';
import '@/polyfill/element_closest_polyfill';
import './calendar.scss';

const Calendar = ({ lang, date: rawDate, onSelect }) => {
  const today = new Date();
  const todayStr = today.toLocaleDateString('zh').replace(/\//g, '');
  const initDate = isValidDate(rawDate) ? rawDate : today;
  const YEAR_RANGE_NUM = 10;
  /**
   * mode 顯示模式
   * 0: 日期
   * 1: 月份
   * 2: 年份
   * */
  const [mode, setMode] = useState(0);
  const [renderDate, setRenderDate] = useState(dateToObj(initDate));
  const [selectedDateStr, setSelectedDateStr] = useState(dateToStr(initDate));
  const yearRangeStart = useMemo(() => Math.floor(renderDate.year / 10) * 10, [renderDate]);

  useEffect(() => {
    if (isValidDate(rawDate)) {
      const formattedDateStr = rawDate.replace(/(-)0(\d{1})/g, '$1$2');
      setRenderDate(dateToObj(rawDate));
      setSelectedDateStr(formattedDateStr);
    }
  }, [rawDate]);


  const LANG_SRC = LOCALES[lang];
  const modeStr = {
    0: lang === 'zh' || lang === 'jp' ? `${renderDate.year}年 ${LANG_SRC.MONTH[renderDate.month]}` : `${LANG_SRC.MONTH[renderDate.month]} ${renderDate.year}`,
    1: `${renderDate.year}`,
    2: `${yearRangeStart} - ${yearRangeStart + YEAR_RANGE_NUM - 1}`,
  };


  const getDays = ({
    year,
    month,
  }) => {
    const days = [];
    const WEEK_ROW = 6;
    const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const isLeapYear = (checkYear) => new Date(checkYear, 1, 29).getDate() === 29;
    const getMonthDays = (checkYear, checkMonth) => (
      isLeapYear(checkYear) && checkMonth === 2 ? 29 : MONTH_DAYS[checkMonth - 1]
    );
    const getPrevMonthLastDate = (curDate) => {
      curDate.setDate(0);
      return curDate;
    };

    const daysLength = WEEK_ROW * LANG_SRC.DAY.length;
    const curMonthDays = getMonthDays(year, month);
    const curMonthFirstDay = new Date(`${year}-${month}-01`).getDay();

    const prevMonthRemainLength = curMonthFirstDay % 7;
    const prevMonthLastDate = getPrevMonthLastDate(new Date(year, month - 1));
    const [prevYear, prevMonth, prevDate] = dateToAry(prevMonthLastDate);
    const prevMonthFirstRenderDate = prevDate - prevMonthRemainLength + 1;

    const nextMonthRemainLength = daysLength - curMonthDays - prevMonthRemainLength;
    const [nextYear, nextMonth, nextDate] = dateToAry(new Date(year, month, 1));

    for (let i = 0; i < prevMonthRemainLength; i += 1) {
      days.push({
        year: prevYear,
        month: prevMonth,
        date: i + prevMonthFirstRenderDate,
      });
    }

    for (let i = 0; i < curMonthDays; i += 1) {
      days.push({
        year,
        month,
        date: i + 1,
        isCurMonth: true,
        isToday: todayStr === `${year}${month}${i + 1}`,
      });
    }

    for (let i = 0; i < nextMonthRemainLength; i += 1) {
      days.push({
        year: nextYear,
        month: nextMonth,
        date: i + nextDate,
      });
    }
    return days;
  };

  /**
   * 切換頁面
   * @param {Number} curMode
   * @param {Number} action
   */
  const chageRenderDate = (curMode, action) => {
    if (curMode === 0) {
      setRenderDate(({ year, month, date }) => dateToObj(new Date(year, month - 1 + action, date)));
    } else if (curMode === 1) {
      setRenderDate((origDate) => ({ ...origDate, year: origDate.year + action }));
    } else if (curMode === 2) {
      setRenderDate((origDate) => ({ ...origDate, year: origDate.year + action * YEAR_RANGE_NUM }));
    }
  };

  const handleAction = (e, moveVal = 0) => {
    const $button = e.target.closest('button');
    const { action } = $button.dataset;
    if (!action) return;

    if (action === 'mode') {
      setMode((curMode) => (curMode + 1 > 2 ? 0 : curMode + 1));
    } else {
      chageRenderDate(mode, moveVal || action === 'prev' ? -1 : 1);
    }
  };

  const handleDateSelect = (e) => {
    const $date = e.target.closest('div');
    const { date } = $date.dataset;
    if (date) {
      setSelectedDateStr(date);
      onSelect(new Date(date));
    }
  };

  const handleMonthSelect = (e) => {
    const $month = e.target.closest('div');
    const { month } = $month.dataset;
    if (month) {
      setRenderDate((origDate) => ({ ...origDate, month: +month }));
      setMode(0);
    }
  };

  const handleYearSelect = (e) => {
    const $year = e.target.closest('div');
    const { year } = $year.dataset;
    if (year) {
      setRenderDate((origDate) => ({ ...origDate, year: +year }));
      setMode(1);
    }
  };

  const handleKeyboardActionEvent = (e, handler) => {
    const isLeft = e.key === 'ArrowLeft';
    const isRight = e.key === 'ArrowRight';
    if (isLeft) {
      handler(e, -1);
    } else if (isRight) {
      handler(e, 1);
    }
  };

  return (
    <div className="rt-calendar">
      <div className="rt-calendar__header">
        <div
          className="rt-calendar__header__cur-month"
          role="button"
          tabIndex="0"
          onClick={handleAction}
          onKeyDown={(e) => handleKeyboardActionEvent(e, handleAction)}
        >
          <button
            data-action="prev"
            className="rt-calendar__reset-btn rt-calendar__icon"
            type="button"
            aria-label="previous"
          >
            <img src={Iconleft} alt="back" />
          </button>
          <button
            data-action="mode"
            className="rt-calendar__reset-btn rt-calendar__action-btn"
            type="button"
            aria-label="change mode"
          >
            {modeStr[mode]}
          </button>
          <button
            data-action="next"
            className="rt-calendar__reset-btn rt-calendar__icon"
            type="button"
          >
            <img src={IconRight} alt="next month" />
          </button>
        </div>
      </div>
      <div className="rt-calendar__main">
        {
          mode === 0 && (
            <>
              <div className="rt-calendar__day-name">
                { LANG_SRC.DAY.map((dayName) => (
                  <div className="rt-calendar__day-name__text" key={dayName}>{dayName}</div>
                ))}
              </div>
              <div
                className="rt-calendar__date"
                tabIndex="0"
                role="button"
                aria-label="select date"
                onClick={handleDateSelect}
              >
                { getDays({ ...renderDate, selectedDateStr }).map(({
                  isCurMonth,
                  isToday,
                  ...dateInfo
                }) => {
                  const dateInfoStr = Object.values(dateInfo).join('-');
                  const isSelectedDate = selectedDateStr && selectedDateStr === dateInfoStr;
                  const outsideClass = !isCurMonth ? 'rt-calendar__outside' : '';
                  const selectedClass = isSelectedDate ? 'rt-calendar__selected' : '';
                  const todayClass = isToday && !isSelectedDate ? 'rt-calendar__date__day--today' : '';
                  const className = `rt-calendar__date__day ${outsideClass} ${selectedClass} ${todayClass}`;
                  return (
                    <div
                      className={className}
                      data-date={dateInfoStr}
                      key={Object.values(dateInfo).join('')}
                    >
                      {dateInfo.date}
                    </div>
                  );
                })}
              </div>
            </>
          )
        }
        {
          mode === 1 && (
            <div
              className="rt-calendar__month"
              tabIndex="0"
              role="button"
              aria-label="select month"
              onClick={handleMonthSelect}
            >
              {
                Object.entries(LANG_SRC.MONTH).map(([month, monthText]) => (
                  <div
                    className={`rt-calendar__month-name ${+month === renderDate.month ? 'rt-calendar__selected' : ''}`}
                    data-month={month}
                    key={month}
                  >
                    {monthText}
                  </div>
                ))
              }
            </div>
          )
        }
        {
          mode === 2 && (
            <div
              className="rt-calendar__year"
              tabIndex="0"
              role="button"
              aria-label="select year"
              onClick={handleYearSelect}
            >
              {
                Array(12).fill(yearRangeStart - 1).map((year, index) => {
                  const isOutsideYear = index === 0 || index === 11;
                  const yearVal = year + index;
                  const outsideClass = isOutsideYear ? 'rt-calendar__outside' : '';
                  const selectedClass = yearVal === renderDate.year ? 'rt-calendar__selected' : '';
                  const className = `rt-calendar__year-name ${outsideClass} ${selectedClass}`
                  return (
                    <div
                      className={className}
                      data-year={yearVal}
                      key={yearVal}
                    >
                      {yearVal}
                    </div>
                  );
                })
              }
            </div>
          )
        }
      </div>

    </div>
  );
};

Calendar.propTypes = {
  lang: PropTypes.string,
  date: PropTypes.string,
  onSelect: PropTypes.func,
};

Calendar.defaultProps = {
  lang: 'en',
  date: '',
  onSelect: () => {},
};

export default Calendar;
