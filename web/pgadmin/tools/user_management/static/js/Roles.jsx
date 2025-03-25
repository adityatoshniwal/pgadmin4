import React, { useMemo } from 'react';
import gettext from 'sources/gettext';
import PgTable from '../../../../static/js/components/PgTable';
import { getDeleteCell, getEditCell } from '../../../../static/js/components/PgReactTableStyled';
import RoleDialog from './RoleDialog';
import Loader from 'sources/components/Loader';

import getApiInstance, { parseApiError } from '../../../../static/js/api_instance';
import url_for from 'sources/url_for';
import { BROWSER_PANELS } from '../../../../browser/static/js/constants';
import ErrorBoundary from '../../../../static/js/helpers/ErrorBoundary';
import { Box } from '@mui/material';
import {Add as AddIcon, SyncRounded, Help as HelpIcon} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { PgButtonGroup, PgIconButton } from '../../../../static/js/components/Buttons';

function CustomHeader({updateRoles}) {
    return (
        <Box>
            <PgButtonGroup>
                <PgIconButton
                    icon={<AddIcon style={{ height: '1.4rem' }} />}
                    aria-label="Create Role"
                    title={gettext('Create Role...')}
                    onClick={() => {
                        const panelTitle = gettext('Create Role');
                        const panelId = BROWSER_PANELS.USER_MANAGEMENT + '-new-role';
                        pgAdmin.Browser.docker.default_workspace.openDialog({
                            id: panelId,
                            title: panelTitle,
                            content: (
                                <ErrorBoundary>
                                    <RoleDialog
                                        user={{}}
                                        onClose={(_e, reload) => {
                                            pgAdmin.Browser.docker.default_workspace.close(panelId, true);
                                            reload && updateUsers();
                                        }}
                                    />
                                </ErrorBoundary>
                            )
                        }, pgAdmin.Browser.stdW.md, pgAdmin.Browser.stdH.sm);
                    }}
                ></PgIconButton>
                <PgIconButton
                    icon={<SyncRounded style={{ height: '1.4rem' }} />}
                    aria-label="Refresh"
                    title={gettext('Refresh')}
                    onClick={updateRoles}
                ></PgIconButton>
                <PgIconButton
                    icon={<HelpIcon style={{ height: '1.4rem' }} />}
                    aria-label="Help"
                    title={gettext('Help')}
                    onClick={() => {
                        window.open(url_for('help.static', { 'filename': 'user_management.html' }));
                    }}
                ></PgIconButton>
            </PgButtonGroup>
        </Box>
    );
}
CustomHeader.propTypes = {
    updateUsers: PropTypes.func,
    options: PropTypes.object,
};

export default function Roles({roles, updateRoles}) {
    const [loading, setLoading] = React.useState('');
    const api = getApiInstance();

    const onDeleteClick = (row) => {
        pgAdmin.Browser.notifier.confirm(gettext('Delete Role'), gettext('Are you sure you want to delete the role %s?', row.original.name),
        async () => {
            setLoading(gettext('Deleting role...'));
            try {
                await api.delete(url_for('user_management.role', { id: row.original.id }));
                pgAdmin.Browser.notifier.success(gettext('Role deleted successfully.'));
                updateRoles();
            } catch (error) {
                pgAdmin.Browser.notifier.error(parseApiError(error));
            }
            setLoading('');
        });
    };

    const onEditClick = (row) => {
        const role = row.original;
        const panelTitle = gettext('Edit Role - %s', role.name);
        const panelId = BROWSER_PANELS.USER_MANAGEMENT + '-edit-role' + role.id;
        pgAdmin.Browser.docker.default_workspace.openDialog({
            id: panelId,
            title: panelTitle,
            content: (
              <ErrorBoundary>
                <RoleDialog
                    role={role}
                  onClose={(_e, reload) => {
                    pgAdmin.Browser.docker.default_workspace.close(panelId, true);
                    reload && updateUsers();
                  }}
                />
              </ErrorBoundary>
            )
        }, pgAdmin.Browser.stdW.md, pgAdmin.Browser.stdH.sm);
    };

    const columns = useMemo(() => [{
        header: () => null,
        enableSorting: false,
        enableResizing: false,
        enableFilters: false,
        size: 35,
        maxSize: 35,
        minSize: 35,
        id: 'btn-delete',
        cell: getDeleteCell({ title: gettext('Delete Role'), onClick: onDeleteClick, isDisabled: (row) => !row.original.canDrop }),
    },{
        header: () => null,
        enableSorting: false,
        enableResizing: false,
        enableFilters: false,
        size: 35,
        maxSize: 35,
        minSize: 35,
        id: 'btn-edit',
        cell: getEditCell({ title: gettext('Edit Role'), onClick: onEditClick }),
    },
    {
        header: gettext('Name'),
        accessorKey: 'name',
        size: 100,
    },
    {
        header: gettext('User Count'),
        accessorKey: 'user_count',
        size: 50,
    }], []);

    return (
        <Box sx={{position: 'relative', height: '100%'}}>
            <Loader message={loading} />
            <PgTable
                data-test="roles"
                columns={columns}
                data={roles}
                sortOptions={[{ id: 'name', desc: false }]}
                caveTable={false}
                tableNoBorder={false}
                tableProps={{
                    getRowId: (row) => {
                        return row.id;
                    }
                }}
                customHeader={<CustomHeader updateRoles={updateRoles} />}
            ></PgTable>
        </Box>
    );
}