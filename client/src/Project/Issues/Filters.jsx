import React from 'react';
import PropTypes from 'prop-types';

import { IssueType, IssueTypeCopy, IssueStatus, IssueStatusCopy, IssuePriority, IssuePriorityCopy } from 'shared/constants/issues';
import { InputDebounced, Select } from 'shared/components';

import { Filters, SearchInput, FilterSelect, ClearAll } from './Styles';

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
        options={projectUsers.map(user => ({ value: user.id, label: user.name }))}
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
        options={Object.values(IssueType).map(type => ({ value: type, label: IssueTypeCopy[type] }))}
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
        options={Object.values(IssueStatus).map(status => ({
          value: status,
          label: IssueStatusCopy[status],
        }))}
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
        options={Object.values(IssuePriority).map(priority => ({
          value: priority,
          label: IssuePriorityCopy[priority],
        }))}
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
