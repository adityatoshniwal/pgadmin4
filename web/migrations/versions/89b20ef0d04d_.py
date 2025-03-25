
"""empty message

Revision ID: 89b20ef0d04d
Revises: e982c040d9b5
Create Date: 2025-03-21 13:55:44.614151

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '89b20ef0d04d'
down_revision = 'e982c040d9b5'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('role', sa.Column('permissions', sa.Text()))


def downgrade():
    # pgAdmin only upgrades, downgrade not implemented.
    pass
