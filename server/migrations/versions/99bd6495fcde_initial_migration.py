"""Initial migration

Revision ID: 99bd6495fcde
Revises: 
Create Date: 2025-01-29 15:00:01.607429

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '99bd6495fcde'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('call_listener',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('initiator_id', sa.Integer(), nullable=False),
    sa.Column('receiver_id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=False),
    sa.ForeignKeyConstraint(['initiator_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['receiver_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('call_listener')
    # ### end Alembic commands ###
