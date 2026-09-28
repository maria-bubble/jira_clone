import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { IssueTypeCopy, IssueStatusCopy, IssuePriorityCopy } from 'shared/constants/issues';
import { formatDate, formatDateTimeConversational } from 'shared/utils/dateTime';
import { IssueTypeIcon, IssuePriorityIcon } from 'shared/components';

import {
  Table,
  TableHeaderRow,
  HeaderCell,
  SortIcon,
  Row,
  Cell,
  Key,
  TypeCell,
  Title,
  Assignees,
  AssigneeAvatar,
  PriorityCell,
  StatusPill,
  DateCell,
  Empty,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  issues: PropTypes.array.isRequired,
  sorting: PropTypes.object.isRequired,
  mergeSorting: PropTypes.func.isRequired,
};

const sortableColumns = [
  { field: 'id', label: 'Key' },
  { field: 'type', label: 'Type' },
  { field: 'title', label: 'Summary' },
  { field: 'assignees', label: 'Assignee' },
  { field: 'priority', label: 'Priority' },
  { field: 'status', label: 'Status' },
  { field: 'createdAt', label: 'Created' },
  { field: 'updatedAt', label: 'Updated' },
];

const ProjectIssuesTable = ({ project, issues, sorting, mergeSorting }) => {
  const match = useRouteMatch();
  const history = useHistory();

  const handleSortClick = field => {
    if (sorting.field === field) {
      mergeSorting({ direction: sorting.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      mergeSorting({ field, direction: getDefaultDirection(field) });
    }
  };

  return (
    <Table data-testid="issues-table">
      <TableHeaderRow>
        {sortableColumns.map(({ field, label }) => (
          <HeaderCell
            key={field}
            isSortable
            isActive={sorting.field === field}
            onClick={() => handleSortClick(field)}
          >
            {label}
            {sorting.field === field && (
              <SortIcon type={sorting.direction === 'asc' ? 'chevron-up' : 'chevron-down'} size={14} />
            )}
          </HeaderCell>
        ))}
      </TableHeaderRow>
      {issues.length === 0 ? (
        <Empty>No issues match the current filters.</Empty>
      ) : (
        issues.map(issue => {
          const assignees = issue.userIds
            .map(userId => project.users.find(user => user.id === userId))
            .filter(Boolean);
          return (
            <Row
              key={issue.id}
              data-testid="issues-table-row"
              onClick={() => history.push(`${match.url}/issues/${issue.id}`)}
            >
              <Cell>
                <Key>#{issue.id}</Key>
              </Cell>
              <Cell>
                <TypeCell>
                  <IssueTypeIcon type={issue.type} />
                  {IssueTypeCopy[issue.type]}
                </TypeCell>
              </Cell>
              <Cell>
                <Title>{issue.title}</Title>
              </Cell>
              <Cell>
                <Assignees>
                  {assignees.map(user => (
                    <AssigneeAvatar
                      key={user.id}
                      size={24}
                      avatarUrl={user.avatarUrl}
                      name={user.name}
                    />
                  ))}
                </Assignees>
              </Cell>
              <Cell>
                <PriorityCell>
                  <IssuePriorityIcon priority={issue.priority} />
                  {IssuePriorityCopy[issue.priority]}
                </PriorityCell>
              </Cell>
              <Cell>
                <StatusPill color={issue.status}>{IssueStatusCopy[issue.status]}</StatusPill>
              </Cell>
              <Cell>
                <DateCell>{formatDate(issue.createdAt)}</DateCell>
              </Cell>
              <Cell>
                <DateCell>{formatDateTimeConversational(issue.updatedAt)}</DateCell>
              </Cell>
            </Row>
          );
        })
      )}
    </Table>
  );
};

const getDefaultDirection = field => {
  if (['createdAt', 'updatedAt', 'priority', 'id'].includes(field)) return 'desc';
  return 'asc';
};

ProjectIssuesTable.propTypes = propTypes;

export default ProjectIssuesTable;
