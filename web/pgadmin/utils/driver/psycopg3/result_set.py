##########################################################################
#
# pgAdmin 4 - PostgreSQL Tools
#
# Copyright (C) 2013 - 2025, The pgAdmin Development Team
# This software is released under the PostgreSQL Licence
#
##########################################################################

import psycopg

class ResultSet:
    def __init__(self, cur):
        self.cur = cur
        self.row_count = 0
        self.column_info = None

    def get_column_info(self):
        """
        This function will returns list of columns for last async sql command
        executed on the server.
        """

        return self.column_info

    def get_result(self):
        if self.cur.get_rowcount() > 0:
            return None
        try:
            result = self.cur.fetchall(_tupples=True)
        except psycopg.ProgrammingError:
            result = None
        except psycopg.Error:
            result = None

        return result
