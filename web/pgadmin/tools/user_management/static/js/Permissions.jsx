import React, { useMemo } from 'react';
import url_for from 'sources/url_for';
import gettext from 'sources/gettext';
import getApiInstance from '../../../../static/js/api_instance';
import { useEffect } from 'react';
import { Box, FormLabel } from '@mui/material';
import SectionContainer from '../../../../dashboard/static/js/components/SectionContainer';
import { InputCheckbox, InputSelect, InputText } from '../../../../static/js/components/FormComponents';
import { SearchRounded } from '@mui/icons-material';
import { PrimaryButton } from '../../../../static/js/components/Buttons';
import { usePgAdmin } from '../../../../static/js/PgAdminProvider';
import Loader from 'sources/components/Loader';

function PermissionsForRole({sections, selectedPerms, setSelectedPerms}) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
        {Object.keys(sections).map(section => {
            const itemCount = sections[section].length ?? 0;

            return <SectionContainer key={section} title={section} style={{minHeight: 0, height: 'auto'}}>
                <Box sx={{p: '8px', display: 'grid', gridAutoFlow: 'column', gridTemplateRows: '1fr '.repeat(Math.ceil(itemCount/2)), gap: '4px'}}>
                    {sections[section].map(item => (
                        <InputCheckbox
                            key={item.name}
                            controlProps={{
                                label: item.label,
                            }}
                            value={selectedPerms.includes(item.name)}
                            onChange={(e) => {
                                let val = e.target.checked;
                                setSelectedPerms((prev) => {
                                    if (val) {
                                        return [...prev, item.name];
                                    } else {
                                        return prev.filter((p) => p !== item.name);
                                    }
                                });
                            }}
                            sx={{widht: 'fit-content'}}
                        />
                    ))}
                </Box>
            </SectionContainer>
        })}
        </Box>
    )
}

export default function Permissions({roles, updateRolePermissions}) {
    const api = getApiInstance();
    const [allPermissions, setAllPermissions] = React.useState([]);
    const [searchVal, setSearchVal] = React.useState('');
    const [selectedPerms, setSelectedPerms] = React.useState([]);
    const [selectedRole, setSelectedRole] = React.useState();
    const [loading, setLoading] = React.useState('');
    const pgAdmin = usePgAdmin();

    const isDirty = useMemo(() => {
        return JSON.stringify(roles.find((r)=>r.id === selectedRole)?.permissions.sort() || []) !== JSON.stringify(selectedPerms.sort());
    }, [selectedRole, selectedPerms, roles]);

    const savePermissions = async () => {
        const url = url_for('user_management.save_permissions', {rid: selectedRole});
        try {
            setLoading(gettext('Saving...'));
            const resp = await api.put(url, {permissions: selectedPerms});
            updateRolePermissions(selectedRole, resp.data.permissions);
            pgAdmin.Browser.notifier.success(gettext('Permissions saved successfully'));
        } catch (error) {
            pgAdmin.Browser.notifier.error(gettext('Failed to save permissions'));
            console.error(error);
        }
        setLoading('');
    }

    useEffect(() => {
        const url = url_for('user_management.all_permissions');
        api.get(url)
            .then(response => {
                setAllPermissions(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    useEffect(() => {
        setSelectedPerms(roles.find((r)=>r.id === selectedRole)?.permissions || []);
    }, [selectedRole]);

    const filteredAllPermissions = useMemo(() => {
        return allPermissions.filter(perm => perm.label.toLowerCase().includes(searchVal.toLowerCase()));
    }, [allPermissions, searchVal]);

    const sections = useMemo(()=>{
        return filteredAllPermissions.reduce((acc, perm) => {
            let section = perm.category;
            if (!acc[section]) {
                acc[section] = [];
            }
            acc[section].push(perm);
            return acc;
        }, {});
    }, [filteredAllPermissions]);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative', height: '100%'}}>
            <Loader message={loading} />
            <Box sx={{display: 'flex', gap: '4px', alignItems: 'center'}}>
                <FormLabel>{gettext('Role')}</FormLabel>
                <Box sx={{minWidth: '300px'}}>
                    <InputSelect
                        options={roles.filter((r)=>r.name != 'Administrator').map((r) => ({ label: r.name, value: r.id }))}
                        optionsReloadBasis={roles.map((r)=>r.name).join('')}
                        onChange={(val) => {setSelectedRole(val)}}
                        value={selectedRole}
                        placeholder={gettext('Select Role')}
                    />
                </Box>
                <PrimaryButton disabled={!isDirty||loading} onClick={savePermissions}>{gettext('Save')}</PrimaryButton>
                <Box sx={{marginLeft: 'auto', minWidth: '300px'}}>
                    <InputText
                        placeholder={gettext('Search')}
                        controlProps={{ title: gettext('Search') }}
                        value={searchVal}
                        onChange={(val) => {
                            setSearchVal(val);
                        }}
                        startAdornment={<SearchRounded />}
                    />
                </Box>
            </Box>
            {selectedRole &&
            <Box sx={{overflowY: 'auto', flexGrow: 1}}>
                <PermissionsForRole sections={sections} selectedPerms={selectedPerms} setSelectedPerms={setSelectedPerms}/>
            </Box>}
        </Box>
    );
}