import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Route, useRouteMatch, useHistory } from 'react-router-dom';
import { intersection } from 'lodash';

import useMergeState from 'shared/hooks/mergeState';
import { Breadcrumbs, Modal } from 'shared/components';
import { IssueStatus } from 'shared/constants/issues';

import Filters from './Filters';
import IssueTable from './IssueTable';
import IssueDetails from '../Board/IssueDetails';
import { IssuesPage } from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
};

const defaultFilters = {
  searchTerm: '',
  userIds: [],
  types: [],
  statuses: [],
  priorities: [],
};

const defaultSorting = { field: 'createdAt', direction: 'desc' };

const statusOrder = Object.values(IssueStatus);

const ProjectIssues = ({ project, fetchProject, updateLocalProjectIssues }) => {
  const match = useRouteMatch();
  const history = useHistory();

  const [filters, mergeFilters] = useMergeState(defaultFilters);
  const [sorting, mergeSorting] = useMergeState(defaultSorting);

  const issues = useMemo(() => filterAndSortIssues(project, filters, sorting), [
    project,
    filters,
    sorting,
  ]);

  return (
    <Fragment>
      <Breadcrumbs items={['Projects', project.name, 'Issues and filters']} />
      <Filters
        projectUsers={project.users}
        defaultFilters={defaultFilters}
        filters={filters}
        mergeFilters={mergeFilters}
      />
      <IssueTable project={project} issues={issues} sorting={sorting} mergeSorting={mergeSorting} />
      <Route
        path={`${match.path}/issues/:issueId`}
        render={routeProps => (
          <Modal
            isOpen
            testid="modal:issue-details"
            width={1040}
            withCloseIcon={false}
            onClose={() => history.push(match.url)}
            renderContent={modal => (
              <IssueDetails
                issueId={routeProps.match.params.issueId}
                projectUsers={project.users}
                fetchProject={fetchProject}
                updateLocalProjectIssues={updateLocalProjectIssues}
                modalClose={modal.close}
              />
            )}
          />
        )}
      />
    </Fragment>
  );
};

const filterAndSortIssues = (project, filters, sorting) => {
  const { searchTerm, userIds, types, statuses, priorities } = filters;
  const searchTermLower = searchTerm.toLowerCase();

  let issues = project.issues;

  if (searchTermLower) {
    issues = issues.filter(issue => issue.title.toLowerCase().includes(searchTermLower));
  }
  if (userIds.length > 0) {
    issues = issues.filter(issue => intersection(issue.userIds, userIds).length > 0);
  }
  if (types.length > 0) {
    issues = issues.filter(issue => types.includes(issue.type));
  }
  if (statuses.length > 0) {
    issues = issues.filter(issue => statuses.includes(issue.status));
  }
  if (priorities.length > 0) {
    issues = issues.filter(issue => priorities.includes(issue.priority));
  }

  return [...issues].sort(createComparator(sorting, project.users));
};

const createComparator = ({ field, direction }, projectUsers) => (a, b) => {
  const result = compareByField(a, b, field, projectUsers);
  return direction === 'asc' ? result : -result;
};

const compareByField = (a, b, field, projectUsers) => {
  switch (field) {
    case 'id':
      return a.id - b.id;
    case 'title':
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    case 'type':
      return a.type.localeCompare(b.type);
    case 'assignees': {
      const nameA = getFirstAssigneeName(a, projectUsers);
      const nameB = getFirstAssigneeName(b, projectUsers);
      return nameA.localeCompare(nameB);
    }
    case 'priority':
      return Number(a.priority) - Number(b.priority);
    case 'status':
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    case 'createdAt':
      return new Date(a.createdAt) - new Date(b.createdAt);
    case 'updatedAt':
      return new Date(a.updatedAt) - new Date(b.updatedAt);
    default:
      return 0;
  }
};

const getFirstAssigneeName = (issue, projectUsers) => {
  const firstUserId = issue.userIds[0];
  if (!firstUserId) return '';
  const user = projectUsers.find(({ id }) => id === firstUserId);
  return user ? user.name.toLowerCase() : '';
};

ProjectIssues.propTypes = propTypes;

export default ProjectIssues;
