import React, { useState } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import Calendar from '@/components/Calendar/Calendar';
import { dateToStr } from '@/utils';
import './datepicker.scss';

const Datepicker = ({ lang, date: initDate, onSelect }) => {
  const [date, setDate] = useState(initDate);
  const [calendarShow, setCalendarShow] = useState(false);

  Datepicker.handleClickOutside = () => setCalendarShow(false);

  const handleSelect = (selectedDate) => {
    const dataStr = dateToStr(selectedDate, true);
    setDate(dataStr);
    onSelect(dataStr);
  };

  const handleDate = (e) => {
    const { value } = e.target;
    if (value.length > 10) return;
    setDate(value);
  };

  const handleKeyDownDate = (e) => {
    const { key } = e;
    const isEnter = key === 'Enter';
    const isValidKey = /\d/.test(key) || key === 'Backspace' || key === 'ArrowLeft' || key === 'ArrowRight' || key === '-';
    if (isEnter) {
      e.preventDefault();
      setCalendarShow(!calendarShow);
    }
    if (!isValidKey) {
      e.preventDefault();
    }
  };

  return (
    <div className="rt-datepicker">
      <input
        className="rt-datepicker__input"
        type="text"
        value={date}
        onClick={() => setCalendarShow(true)}
        onChange={handleDate}
        onKeyDown={handleKeyDownDate}
        placeholder="yyyy-mm-dd"
      />
      <div className={`rt-datepicker__calendar ${ calendarShow ? 'rt-datepicker__calendar--show' : '' }`}>
        <Calendar lang={lang} date={date} onSelect={handleSelect} />
      </div>
    </div>
  );
};

Datepicker.propTypes = {
  lang: PropTypes.string,
  date: PropTypes.string,
  onSelect: PropTypes.func,
};

Datepicker.defaultProps = {
  lang: 'en',
  date: '',
  onSelect: () => {},
};

const clickOutsideConfig = {
  handleClickOutside: () => Datepicker.handleClickOutside,
};

export default onClickOutside(Datepicker, clickOutsideConfig);
