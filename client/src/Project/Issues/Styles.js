import styled from 'styled-components';

import {
  issueStatusColors,
  issueStatusBackgroundColors,
  color,
  font,
  mixin,
} from 'shared/utils/styles';
import { InputDebounced, Select, Icon, Avatar } from 'shared/components';

export const IssuesPage = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Filters = styled.div`
  display: flex;
  align-items: center;
  margin-top: 24px;
  flex-wrap: wrap;
`;

export const SearchInput = styled(InputDebounced)`
  margin-right: 18px;
  width: 160px;
`;

export const FilterSelect = styled(Select)`
  margin-right: 9px;
  width: 130px;
`;

export const ClearAll = styled.div`
  height: 32px;
  line-height: 32px;
  margin-left: 15px;
  padding-left: 12px;
  border-left: 1px solid ${color.borderLightest};
  color: ${color.textDark};
  ${font.size(14.5)}
  ${mixin.clickable}
  &:hover {
    color: ${color.textMedium};
  }
`;

export const ResultsCount = styled.div`
  margin-top: 20px;
  ${font.size(14.5)}
  ${font.medium}
  color: ${color.textDark};
`;

export const Table = styled.div`
  margin-top: 10px;
  background: #fff;
  border: 1px solid ${color.borderLightest};
  border-radius: 3px;
  ${mixin.scrollableY}
`;

export const TableHeaderRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${color.borderLightest};
  padding: 8px 0;
`;

export const HeaderCell = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding: 0 12px;
  color: ${color.textMedium};
  ${font.size(13)}
  ${font.bold}
  text-transform: uppercase;
  ${props => props.isSortable && mixin.clickable}
  ${props => props.isActive && `color: ${color.textDarkest};`}
  &:hover {
    ${props => props.isSortable && `color: ${color.textDarkest};`}
  }
`;

export const SortIcon = styled(Icon)`
  margin-left: 4px;
  color: ${color.textMedium};
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 8px 0;
  border-bottom: 1px solid ${color.borderLightest};
  transition: background 0.1s;
  ${mixin.clickable}
  &:hover {
    background: ${color.backgroundLightest};
  }
  &:last-child {
    border-bottom: none;
  }
`;

export const Cell = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding: 0 12px;
  ${font.size(14)}
  color: ${color.textDark};
`;

export const Key = styled.div`
  color: ${color.textLink};
  ${font.size(14)}
  ${font.bold}
`;

export const TypeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  ${font.size(14)}
  color: ${color.textDark};
`;

export const Title = styled.div`
  ${mixin.truncateText}
`;

export const Assignees = styled.div`
  display: flex;
`;

export const AssigneeAvatar = styled(Avatar)`
  margin-left: -6px;
  box-shadow: 0 0 0 2px #fff;
  &:first-child {
    margin-left: 0;
  }
`;

export const PriorityCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  ${font.size(14)}
  color: ${color.textDark};
`;

export const StatusPill = styled.div`
  text-transform: uppercase;
  ${props => mixin.tag(issueStatusBackgroundColors[props.color], issueStatusColors[props.color])}
`;

export const DateCell = styled.div`
  ${font.size(13.5)}
  color: ${color.textMedium};
  white-space: nowrap;
`;

export const Empty = styled.div`
  padding: 40px 0;
  text-align: center;
  color: ${color.textMedium};
  ${font.size(15)}
`;
