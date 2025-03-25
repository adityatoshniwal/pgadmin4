# <ul role="menu" aria-label="Tools" tabindex="-1" class="szh-menu szh-menu--state-closed szh-menu--align-start szh-menu--dir-bottom" style="margin: 0px; position: absolute; left: 148.547px; top: 14.25px; display: none;"><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="ERD Tool" data-checked="false" class="szh-menu__item szh-menu__item--disabled">ERD Tool<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Grant Wizard..." data-checked="false" class="szh-menu__item szh-menu__item--disabled">Grant Wizard...<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Query Tool" data-checked="false" class="szh-menu__item szh-menu__item--disabled">Query Tool<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" tabindex="-1" data-label="Schema Diff" data-checked="false" class="szh-menu__item">Schema Diff<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="separator" class="szh-menu__divider"></li><li class="szh-menu__submenu" role="none" style="position: relative;"><div role="menuitem" aria-haspopup="true" aria-expanded="false" tabindex="-1" data-label="Server" class="szh-menu__item szh-menu__item--submenu">Server</div><ul role="menu" aria-label="Server" tabindex="-1" class="szh-menu szh-menu--state-closed szh-menu--align-start szh-menu--dir-right" style="margin: 0px; position: absolute; left: 188.492px; top: 0px; display: none;"><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Add Named Restore Point..." data-checked="false" class="szh-menu__item szh-menu__item--disabled">Add Named Restore Point...<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Pause Replay of WAL" data-checked="false" class="szh-menu__item szh-menu__item--disabled">Pause Replay of WAL<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Resume Replay of WAL" data-checked="false" class="szh-menu__item szh-menu__item--disabled">Resume Replay of WAL<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Reload Configuration" data-checked="false" class="szh-menu__item szh-menu__item--disabled">Reload Configuration<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li></ul></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Restore..." data-checked="false" class="szh-menu__item szh-menu__item--disabled">Restore...<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="separator" class="szh-menu__divider"></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Backup Globals..." data-checked="false" class="szh-menu__item szh-menu__item--disabled">Backup Globals...<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Backup Server..." data-checked="false" class="szh-menu__item szh-menu__item--disabled">Backup Server...<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Backup..." data-checked="false" class="szh-menu__item szh-menu__item--disabled">Backup...<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Import/Export Data..." data-checked="false" class="szh-menu__item szh-menu__item--disabled">Import/Export Data...<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Import/Export Servers..." data-checked="false" class="szh-menu__item szh-menu__item--disabled">Import/Export Servers...<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Maintenance..." data-checked="false" class="szh-menu__item szh-menu__item--disabled">Maintenance...<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" aria-disabled="true" tabindex="-1" data-label="Search Objects..." data-checked="false" class="szh-menu__item szh-menu__item--disabled">Search Objects...<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li><li role="menuitem" tabindex="-1" data-label="Storage Manager..." data-checked="false" class="szh-menu__item">Storage Manager...<div style="margin-left: auto; font-size: 0.8em; padding-left: 12px;"></div></li></ul>

class AllPermissionTypes:
    object_register_server = 'object_register_server'
    tools_erd_tool = 'tools_erd_tool'
    tools_query_tool = 'tools_query_tool'
    tools_debugger = 'tools_debugger'
    tools_backup = 'tools_backup'
    tools_restore = 'tools_restore'
    tools_backup_server = 'tools_backup_server'
    tools_backup_globals = 'tools_backup_globals'
    tools_import_export_data = 'tools_import_export_data'
    tools_import_export_servers = 'tools_import_export_servers'
    tools_search_objects = 'tools_search_objects'
    tools_storage_manager = 'tools_storage_manager'
    tools_maintenance = 'tools_maintenance'
    tools_schema_diff = 'tools_schema_diff'
    tools_grant_wizard = 'tools_grant_wizard'
    storage_add_folder = 'storage_add_folder'
    storage_remove_folder = 'storage_remove_folder'
    storage_add_file = 'storage_add_file'
    storage_remove_file = 'storage_remove_file'


class AllPermissionCategories:
    object_explorer = 'Object Explorer'
    tools = 'Tools'
    storage_manager = 'Storage Manager'


class PgPermissions:
    _all_permissions = []

    def __init__(self):
        self.add_permission(
            AllPermissionCategories.object_explorer,
            AllPermissionTypes.object_register_server,
            "Register a new server"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_query_tool,
            "Query tool"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_debugger,
            "Debugger"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_backup,
            "Backup tool"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_restore,
            "Restore tool"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_backup_server,
            "Backup server"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_backup_globals,
            "Backup globals"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_import_export_data,
            "Import/export data"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_import_export_servers,
            "Import/export servers"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_search_objects,
            "Search objects"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_storage_manager,
            "Storage manager"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_maintenance,
            "Perform maintenance"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_schema_diff,
            "Schema diff"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_grant_wizard,
            "Grant wizard"
        )
        self.add_permission(
            AllPermissionCategories.tools,
            AllPermissionTypes.tools_erd_tool,
            "ERD tool"
        )
        self.add_permission(
            AllPermissionCategories.storage_manager,
            AllPermissionTypes.storage_add_folder,
            "Add a folder"
        )
        self.add_permission(
            AllPermissionCategories.storage_manager,
            AllPermissionTypes.storage_remove_folder,
            "Remove a folder"
        )
        self.add_permission(
            AllPermissionCategories.storage_manager,
            AllPermissionTypes.storage_add_file,
            "Add a file"
        )
        self.add_permission(
            AllPermissionCategories.storage_manager,
            AllPermissionTypes.storage_remove_file,
            "Remove a file"
        )

    def add_permission(self, category: str, permission: str, label: str):
        self._all_permissions.append({
            "category": category,
            "name": permission,
            "label": label,
        })

    @property
    def all_permissions(self):
        return sorted(self._all_permissions, key=lambda x: (x['category'], x['label']))
