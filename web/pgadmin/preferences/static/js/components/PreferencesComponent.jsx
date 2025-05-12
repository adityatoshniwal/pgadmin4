/////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2025, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

import gettext from 'sources/gettext';
import { styled } from '@mui/material/styles';
import url_for from 'sources/url_for';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Box, Link } from '@mui/material';
import PropTypes from 'prop-types';
import SchemaView from '../../../../static/js/SchemaView';
import getApiInstance from '../../../../static/js/api_instance';
import HelpIcon from '@mui/icons-material/HelpRounded';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { PgButtonGroup, PgIconButton } from '../../../../static/js/components/Buttons';
import usePreferences from '../store';
import { usePgAdmin } from '../../../../static/js/PgAdminProvider';
import { InputText } from '../../../../static/js/components/FormComponents';
import { SearchRounded } from '@mui/icons-material';
import PreferencesSchema from './preferences.ui';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';


// Import helpers from new file
import {
  reloadPgAdmin,
  getNoteField,
  prepareSubnodeData,
  getCollectionValue,
  onDialogHelp,
  showResetPrefModal
} from './PreferencesHelper';
import PgTreeView from '../../../../static/js/PgTreeView';

// --- Styled Components ---
const Root = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: theme.otherVars.emptySpaceBg,
  overflow: 'hidden',

  '& .PreferencesComponent-header': {
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.background.default,
    padding: theme.spacing(1),
    ...theme.mixins.panelBorder.bottom,

    '& .PreferencesComponent-actionBtn': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },

    '& .PreferencesComponent-searchInput': {
      maxWidth: '300px',
      marginLeft: 'auto',
    },
  },

  '& .PreferencesComponent-body': {
    flexGrow: 1,
    minHeight: 0,
    padding: theme.spacing(1),

    '& .PreferencesComponent-bodyWrap': {
      ...theme.mixins.panelBorder.all,
      display: 'flex',
      height: '100%',
      background: theme.palette.background.default,

      '& .PreferencesComponent-treeContainer': {
        flexBasis: '25%',
        minHeight: 0,
        flexGrow: 1,
      },
      '& .PreferencesComponent-preferencesContainer': {
        flexBasis: '75%',
        borderColor: `${theme.otherVars.borderColor} !important`,
        borderLeft: '1px solid',
        position: 'relative',
        height: '100%',
        overflow: 'auto',

        '& .PreferencesComponent-noSelection': {
          padding: theme.spacing(1),
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(0.5),
        },

        '& .PreferencesComponent-preferencesContainerBackground': {
          backgroundColor: 'inherit',
        },
      },
    },
  },
  '& .PreferencesComponent-footer': {
    borderTop: `1px solid ${theme.otherVars.inputBorderColor} !important`,
    padding: '0.5rem',
    display: 'flex',
    width: '100%',
    background: theme.otherVars.headerBg,
    '& .PreferencesComponent-actionBtn': {
      alignItems: 'flex-start',
    },
    '& .PreferencesComponent-buttonMargin': {
      marginLeft: '0.5em',
    },
  },
}));

function RightPreference({ schema, filteredItemIds, selectedItem, setSelectedItem, initValues, onDataChange }) {
  const schemaViewRef = useRef(null);

  // Memoize initData to prevent unnecessary re-creations
  const getInitData = useCallback(() => {
    return new Promise((resolve, reject) => {
      try {
        resolve(initValues);
      } catch (error) {
        reject(error instanceof Error ? error : Error(gettext('Something went wrong')));
      }
    });
  }, [initValues]);

  const updateVisibleFields = () => {
    if(!selectedItem) return;

    schema.schemaFields.forEach((field) => {
      field.visible = field.parentId === selectedItem.id && filteredItemIds.includes(field.id);
      field.labelTooltip = `${selectedItem.key.toLowerCase()}:${selectedItem.key}:${field.key}`;
    });
    schema.categoryUpdated(selectedItem.id);
  };

  useMemo(() => {
    updateVisibleFields();
  }, [filteredItemIds, selectedItem]);

  if(selectedItem?.children) {
    return (
      <Box className='PreferencesComponent-preferencesContainer'>
        <Box className='PreferencesComponent-noSelection'>
          <Box>{gettext('Navigate to any below item to view or edit its preferences.')}</Box>
          {selectedItem.children.map((child) => (
            <Box key={child.id}>
              <Link component='button' onClick={()=>setSelectedItem(child)} underline="hover">{child.name}</Link>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <div className='PreferencesComponent-preferencesContainer' ref={schemaViewRef}>
      <SchemaView
        key={selectedItem?.id ?? 0}
        formType={'dialog'}
        getInitData={getInitData}
        viewHelperProps={{ mode: 'edit' }}
        schema={schema}
        showFooter={false}
        isTabView={false}
        formClassName='PreferencesComponent-preferencesContainerBackground'
        onDataChange={(isChanged, changedData) => {
          onDataChange(changedData);
        }}
      />
    </div>
  );
}
RightPreference.propTypes = {
  schema: PropTypes.object.isRequired,
  initValues: PropTypes.object.isRequired,
  onDataChange: PropTypes.func.isRequired,
  filteredItemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedItem: PropTypes.object,
  setSelectedItem: PropTypes.func.isRequired,
};


// Helper to check if a page refresh is required
function checkRefreshRequired(pref) {
  // Other preferences might also require a refresh, add them here
  return pref.name === 'user_language';
};


function LeftTree({prefTreeData, selectedItem, setSelectedItem, filteredList}) {
  const filteredTreeData = useMemo(() => {
    const parentIds = filteredList.map((item) => item.parentId);
    const filteredTreeData = prefTreeData.reduce((retVal, category) => {
      const filteredChildren = category.children.filter((child) => parentIds.includes(child.id));
      if( filteredChildren.length > 0) {
        retVal.push({
          ...category,
          children: filteredChildren,
        });
      }
      return retVal;
    }, []);
    return filteredTreeData;
  }, [prefTreeData, filteredList]);

  return (
    <Box className='PreferencesComponent-treeContainer' >
      <PgTreeView
        className='PreferencesComponent-tree'
        idAccessor='id'
        data={filteredTreeData}
        openByDefault={true}
        disableMultiSelection={true}
        selection={selectedItem?.id}
        onFocus={(item) => {
          setSelectedItem(item.data);
        }}
      />
    </Box>
  );
}

LeftTree.propTypes = {
  prefTreeData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired,
  })).isRequired,
  selectedItem: PropTypes.object,
  setSelectedItem: PropTypes.func.isRequired,
  filteredList: PropTypes.array,
};

// --- Main PreferencesComponent ---
export default function PreferencesComponent() {
  const [disableSave, setDisableSave] = useState(true);
  const prefSchema = useRef(new PreferencesSchema({}, []));
  const prefChangedData = useRef({});
  const [prefTreeData, setPrefTreeData] = useState([]);
  const [initValues, setInitValues] = useState({});
  const api = getApiInstance();
  const firstTreeElement = useRef('');
  const preferencesStore = usePreferences();
  const pgAdmin = usePgAdmin();
  const [searchVal, setSearchVal] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchPreferences = async () => {
    try {
      const res = await api({
        url: url_for('preferences.index'),
        method: 'GET',
      });

      const schemaFields = [];
      const treeNodesData = [];
      let values = {};

      res.data.forEach((node) => {
        const id = crypto.getRandomValues(new Uint16Array(1))[0]; // Ensure a single number
        const categoryNode = {
          id: id.toString(),
          name: node.label,
          key: node.name,
          children: [],
        };

        if (firstTreeElement.current.length === 0) {
          firstTreeElement.current = node.label;
        }

        node.children.forEach((subNode) => {
          const sid = crypto.getRandomValues(new Uint16Array(1))[0]; // Ensure a single number
          const nodeData = {
            id: sid.toString(),
            name: subNode.label,
            key: subNode.name,
          };

          categoryNode.children.push(nodeData);
          schemaFields.push(...getNoteField(node, subNode, nodeData));

          const {fieldItems, fieldValues} = prepareSubnodeData(node, subNode, nodeData, preferencesStore);
          schemaFields.push(...fieldItems);
          values = {...values, ...fieldValues};
        });
        treeNodesData.push(categoryNode);
      });

      setPrefTreeData(treeNodesData);
      setInitValues(values);
      setSelectedItem(treeNodesData[0]?.children[0] || null);
      prefSchema.current = new PreferencesSchema(values, schemaFields);
    } catch (err) {
      pgAdmin.Browser.notifier.alert(err.response?.data || err.message || gettext('Failed to load preferences.'));
    }
  };

  // Effect to fetch preferences data on component mount
  useEffect(() => {
    fetchPreferences();
  }, []); // Added dependencies

  const savePreferences = async () => {
    const _data = [];
    for (const [key, value] of Object.entries(prefChangedData.current)) {
      const _metadata = prefSchema.current.schemaFields.find((el) => el.id === key); // Find directly
      if (_metadata) {
        const val = getCollectionValue([_metadata], value, initValues); // Pass _metadata as array for consistency
        _data.push({
          category_id: _metadata.cid,
          id: parseInt(key),
          mid: _metadata.mid,
          name: _metadata.name,
          value: val,
        });
      }
    }

    if (_data.length === 0) {
      // No changes to save, just close modal
      return;
    }

    const layoutPref = _data.find((x) => x.name === 'layout');

    const saveData = async (shouldReloadOnLayoutChange = false) => {
      try {
        await api({
          url: url_for('preferences.index'),
          method: 'PUT',
          data: _data,
        });

        if (shouldReloadOnLayoutChange) {
          await api({
            url: url_for('workspace.layout_changed'),
            method: 'DELETE', // DELETE seems unusual for layout_changed, but maintaining original logic
            data: _data,
          });
          pgAdmin.Browser.tree.destroy().then(() => {
            pgAdmin.Browser.Events.trigger('pgadmin-browser:tree:destroyed', undefined, undefined);
            reloadPgAdmin(); // Reload after destroying tree
          });
        } else {
          const requiresTreeRefresh = _data.some((s) =>
            ['show_system_objects', 'show_empty_coll_nodes', 'hide_shared_server', 'show_user_defined_templates'].includes(s.name) || s.name.startsWith('show_node_')
          );

          let requiresFullPageRefresh = false;
          for (const key of Object.keys(prefChangedData.current)) {
            const pref = preferencesStore.getPreferenceForId(Number(key));
            if (pref && checkRefreshRequired(pref)) {
              requiresFullPageRefresh = true;
              break;
            }
          }

          if (requiresTreeRefresh) {
            pgAdmin.Browser.notifier.confirm(
              gettext('Object explorer refresh required'),
              gettext('An object explorer refresh is required. Do you wish to refresh it now?'),
              () => {
                pgAdmin.Browser.tree.destroy().then(() => {
                  pgAdmin.Browser.Events.trigger('pgadmin-browser:tree:destroyed', undefined, undefined);
                });
                return true;
              },
              () => true,
              gettext('Refresh'),
              gettext('Later')
            );
          }

          if (requiresFullPageRefresh) {
            pgAdmin.Browser.notifier.confirm(
              gettext('Refresh required'),
              gettext('A page refresh is required. Do you wish to refresh the page now?'),
              () => {
                reloadPgAdmin();
                return true;
              },
              () => { }, // Close modal if user opts for "Later"
              gettext('Refresh'),
              gettext('Later')
            );
          }
        }
        preferencesStore.cache(); // Refresh preferences cache
      } catch (err) {
        pgAdmin.Browser.notifier.alert(err.response?.data || err.message || gettext('Failed to save preferences.'));
      }
    };

    if (layoutPref && layoutPref.value === 'classic') {
      pgAdmin.Browser.notifier.confirm(
        gettext('Layout changed'),
        `${gettext('Switching from Workspace to Classic layout will disconnect all server connections and refresh the entire page.')}
         ${gettext('To avoid losing unsaved data, click Cancel to manually review and close your connections.')}
         ${gettext('Note that if you choose Cancel, any changes to your preferences will not be saved.')}<br><br>
         ${gettext('Do you want to continue?')}`,
        () => saveData(true), // User confirms, proceed with reload
        () => false, // User cancels, do nothing
        gettext('Continue'),
        gettext('Cancel')
      );
    } else {
      saveData();
    }
  };

  const resetAllPreferences = () => {
    showResetPrefModal(api, pgAdmin, preferencesStore);
  };

  const filteredList = useFuzzySearchList({
    strategy: 'off',
    queryText: searchVal,
    getText: (item) => [item.label, item.helpMessage],
    list: prefSchema.current.schemaFields,
    mapResultItem: ({ item }) => item
  });

  const filteredItemIds = useMemo(()=>filteredList.map((item) => item.id), [filteredList]);

  return (
    <Root height={'100%'}>
      <Box className='PreferencesComponent-header'>
        <Box className='PreferencesComponent-actionBtn'>
          <PgButtonGroup>
            <PgIconButton
              icon={<SaveSharpIcon style={{height: '1.4rem'}}/>}
              aria-label="Save"
              title={gettext('Save')}
              onClick={savePreferences}
              disabled={disableSave}
            />
          </PgButtonGroup>
          <PgButtonGroup>
            <PgIconButton
              data-test="dialog-help" onClick={onDialogHelp}
              icon={<HelpIcon />} title={gettext('Help')}
            />
            <PgIconButton
              onClick={resetAllPreferences}
              icon={<SettingsBackupRestoreIcon />}
              aria-label="Reset all preferences"
              title={gettext('Reset all preferences')}
            />
          </PgButtonGroup>
        </Box>
        <InputText
          className='PreferencesComponent-searchInput'
          placeholder={gettext('Search')}
          controlProps={{ title: gettext('Search') }}
          value={searchVal}
          onChange={setSearchVal} // Direct setter for state
          startAdornment={<SearchRounded />}
        />
      </Box>
      <Box className='PreferencesComponent-body'>
        <div className='PreferencesComponent-bodyWrap'>
          <LeftTree
            prefTreeData={prefTreeData}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            filteredList={filteredList}
          />
          {
            prefSchema.current &&
            <RightPreference
              schema={prefSchema.current}
              initValues={initValues}
              filteredItemIds={filteredItemIds}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              onDataChange={(changedData) => {
                setDisableSave(Object.keys(changedData).length === 0);
                prefChangedData.current = changedData;
              }}
            />
          }
        </div>
      </Box >
    </Root>
  );
}

// No propTypes needed for PreferencesComponent as it doesn't accept any props
