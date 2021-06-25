import React from 'react';
import Calendar from './Calendar';

export default { title: 'Calendar' };

export const mainEn = () => (
  <div>
    <Calendar lang="en" date="2020-02-01" onSelect={(date) => console.log(date)} />
  </div>
);

export const mainZh = () => (
  <div>
    <Calendar lang="zh" date="2020-02-28" onSelect={(date) => console.log(date)} />
  </div>
);

export const mainJp = () => (
  <div>
    <Calendar lang="jp" date="2020-02-28" onSelect={(date) => console.log(date)} />
  </div>
);
