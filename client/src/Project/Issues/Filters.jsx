import React from 'react';
import PropTypes from 'prop-types';

import { IssueType, IssueTypeCopy, IssueStatus, IssueStatusCopy, IssuePriority, IssuePriorityCopy } from 'shared/constants/issues';
import { InputDebounced, Select, Icon } from 'shared/components';

import {
  Filters,
  SearchInput,
  FilterSelect,
  FilterValueChip,
  FilterValueChipLabel,
  FilterValueChipText,
  ClearAll,
} from './Styles';

const propTypes = {
  projectUsers: PropTypes.array.isRequired,
  defaultFilters: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  mergeFilters: PropTypes.func.isRequired,
};

const ProjectIssuesFilters = ({ projectUsers, defaultFilters, filters, mergeFilters }) => {
  const { searchTerm, userIds, types, statuses, priorities } = filters;

  const areFiltersCleared =
    !searchTerm && userIds.length === 0 && types.length === 0 && statuses.length === 0 && priorities.length === 0;

  const assigneeOptions = projectUsers.map(user => ({ value: user.id, label: user.name }));
  const typeOptions = Object.values(IssueType).map(type => ({ value: type, label: IssueTypeCopy[type] }));
  const statusOptions = Object.values(IssueStatus).map(status => ({ value: status, label: IssueStatusCopy[status] }));
  const priorityOptions = Object.values(IssuePriority).map(priority => ({
    value: priority,
    label: IssuePriorityCopy[priority],
  }));

  const renderFilterValue = (label, selectedValues, options) => ({ value, removeOptionValue }) => {
    const option = options.find(option => option.value === value);
    const isFirst = selectedValues.indexOf(value) === 0;
    return (
      <FilterValueChip
        key={value}
        onClick={event => {
          event.stopPropagation();
          removeOptionValue();
        }}
      >
        {isFirst && <FilterValueChipLabel>{label}</FilterValueChipLabel>}
        <FilterValueChipText>{option ? option.label : value}</FilterValueChipText>
        <Icon type="close" size={10} />
      </FilterValueChip>
    );
  };

  return (
    <Filters data-testid="issues-filters">
      <SearchInput
        icon="search"
        value={searchTerm}
        onChange={value => mergeFilters({ searchTerm: value })}
      />
      <FilterSelect
        variant="normal"
        isMulti
        withClearValue={false}
        dropdownWidth={220}
        name="assignee"
        placeholder="Assignee"
        value={userIds}
        options={assigneeOptions}
        renderValue={renderFilterValue('Assignee', userIds, assigneeOptions)}
        onChange={userIds => mergeFilters({ userIds })}
      />
      <FilterSelect
        variant="normal"
        isMulti
        withClearValue={false}
        dropdownWidth={160}
        name="type"
        placeholder="Type"
        value={types}
        options={typeOptions}
        renderValue={renderFilterValue('Type', types, typeOptions)}
        onChange={types => mergeFilters({ types })}
      />
      <FilterSelect
        variant="normal"
        isMulti
        withClearValue={false}
        dropdownWidth={260}
        name="status"
        placeholder="Status"
        value={statuses}
        options={statusOptions}
        renderValue={renderFilterValue('Status', statuses, statusOptions)}
        onChange={statuses => mergeFilters({ statuses })}
      />
      <FilterSelect
        variant="normal"
        isMulti
        withClearValue={false}
        dropdownWidth={160}
        name="priority"
        placeholder="Priority"
        value={priorities}
        options={priorityOptions}
        renderValue={renderFilterValue('Priority', priorities, priorityOptions)}
        onChange={priorities => mergeFilters({ priorities })}
      />
      {!areFiltersCleared && (
        <ClearAll onClick={() => mergeFilters(defaultFilters)}>Clear filters</ClearAll>
      )}
    </Filters>
  );
};

ProjectIssuesFilters.propTypes = propTypes;

export default ProjectIssuesFilters;
