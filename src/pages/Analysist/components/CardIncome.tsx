import * as React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const CardIncome: React.FC = () => {
  return (
    <Card sx={{ minWidth: 275, boxShadow: 2, borderRadius: 3 }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left section */}
        <Box>
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
            Income
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            $47.482
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" sx={{ color: 'green', fontWeight: 'bold', mr: 1 }}>
              3.85%
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Since last week
            </Typography>
          </Box>
        </Box>

        {/* Right icon circle */}
        <Avatar sx={{ bgcolor: '#f0f4ff', width: 40, height: 40 }}>
          <AttachMoneyIcon sx={{ color: '#5470ff' }} />
        </Avatar>
      </CardContent>
    </Card>
  );
};

export default CardIncome;
