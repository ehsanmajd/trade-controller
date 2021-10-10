import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { AccessType, UserAccessType } from '../../../types/baskets';
import Chips from '../../Chips';
import * as services from '../../../service';
import { User } from '../../../types/user';

interface Props {
  name: string;
  users: UserAccessType[];
  onBasketChange: (users: UserAccessType[]) => void;
  disabled?: boolean;
}

const ExpandableListItem: React.FC<Props> = ({ name, users: basketUsers = [], onBasketChange, disabled = true }) => {
  const users = basketUsers.filter(x => x.accessType === AccessType.User);
  const investors = basketUsers.filter(x => x.accessType === AccessType.Investor);

  const mapUserToChip = (user: User) => {
    return {
      label: user.username,
      key: user.id
    }
  }

  const mapUserAccessToChip = (user: UserAccessType) => {
    return {
      label: user.username,
      key: user.userId
    }
  }

  const usersDatasource = async (keyword: string) => {
    const users = await services.searchUsers(keyword);
    return users.filter(x => !basketUsers.some(u => u.userId === x.id)).map(mapUserToChip);
  }

  const handleChange = (items, accessType: AccessType) => {
    onBasketChange([
      ...basketUsers.filter(x => x.accessType !== accessType),
      ...items.map(x => ({
        userId: x.key,
        username: x.label,
        accessType
      }))
    ])
  }

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <h6>Users:</h6>
          <Chips
            datasource={usersDatasource}
            value={users.map(mapUserAccessToChip)}
            onChange={items => handleChange(items, AccessType.User)}
            disabled={disabled}
          />
        </div>
        <div>
          <h6>Investors:</h6>
          <Chips
            datasource={usersDatasource}
            value={investors.map(mapUserAccessToChip)}
            onChange={items => handleChange(items, AccessType.Investor)}
            disabled={disabled}
          />
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default ExpandableListItem;