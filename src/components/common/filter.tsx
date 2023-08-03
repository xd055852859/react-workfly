import React from 'react';
import './filter.css';
import DropMenu from './dropMenu';

import downArrowbPng from '../../assets/img/downArrowb.png';
import Avatar from './avatar';
interface FilterProps {
  visible: boolean;
  title?: any;
  filterArray: any;
  filterStyle?: object;
  filterType: string;
  filterItemStyle?: object;
  filterIndex?: any;
  onClose?: any;
  onOpen?: any;
  onClick?: any;
  filterItem: any;
  defaultPngType?: number;
}

const Filter: React.FC<FilterProps> = (prop) => {
  const {
    title,
    visible,
    filterArray,
    filterStyle,
    filterType,
    filterItemStyle,
    filterIndex,
    onClose,
    onOpen,
    filterItem,
    defaultPngType,
    onClick,
  } = prop;

  return (
    <div className="filter" style={filterStyle}>
      <div className="filter-title">{title + ' :'}</div>
      <div
        className="filter-menu"
        // onMouseEnter={onOpen}
        // onMouseLeave={onClose}
        onClick={onOpen}
      >
        {filterArray.length > 0 && filterArray[filterIndex] ? (
          <div className="filter-menu-info">
            <Avatar
              avatar={
                filterArray[filterIndex][filterItem[1]]
              }
              name={filterArray[filterIndex][filterItem[0]]}
              type={defaultPngType === 0
                ? 'person'
                : 'group'}
              index={0}
              size={26}
            />
            <div className="filter-menu-name">
              {filterArray[filterIndex][filterItem[0]]}
            </div>
            <img className="filter-menu-icon" src={downArrowbPng} alt="" />
          </div>
        ) : null}
        <DropMenu
          visible={visible}
          dropStyle={filterItemStyle}
          onClose={onClose}
        >
          {filterArray.length > 0 && filterArray[filterIndex] ? filterArray.map((item: any, index: number) => {
            return (
              <div
                className="filter-menu-info"
                key={title + index}
                onClick={(e) => {
                  onClick(filterType, item, index);
                  onClose();
                  e.stopPropagation();
                }}
              >
                <Avatar
                  avatar={
                    item && item[filterItem[1]]
                  }
                  name={filterArray[filterIndex][filterItem[0]]}
                  type={defaultPngType === 0
                    ? 'person'
                    : 'group'}
                  index={0}
                  size={26}
                />
                <div className="filter-menu-name">{item[filterItem[0]]}</div>
              </div>
            );
          }) : null}
        </DropMenu>
      </div>
    </div>
  );
};
Filter.defaultProps = {
  visible: false,
  title: '',
  filterArray: [],
  filterStyle: {},
  filterType: '',
  filterItemStyle: {},
  onClose: undefined,
  onOpen: undefined,
  onClick: undefined,
  filterItem: {},
  defaultPngType: 0,
  filterIndex: 0,
};
export default Filter;
