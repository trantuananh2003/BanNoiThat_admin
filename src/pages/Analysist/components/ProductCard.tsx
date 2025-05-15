import React from 'react';
import {
  Card, CardMedia, CardContent, Typography, Box, Chip, Rating, Stack, IconButton
} from '@mui/material';

const image3 = require('../../../assets/images/3.jpg');
export default function ProductCard() {
  return (
    <Card sx={{ width: 300, borderRadius: 2, boxShadow: 3, position: 'relative' }}>
      {/* Image with badges */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={image3}
          alt="Tủ quần áo"
        />
        {/* Sale Badge */}
        <Chip
          label="-25%"
          color="error"
          size="small"
          sx={{ position: 'absolute', top: 8, left: 8 }}
        />
        {/* New Badge */}
        <Chip
          label="NEW"
          color="warning"
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        />
      </Box>

      {/* Content */}
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          Tủ Quần Áo Gỗ MOHO MONZA 4 Cánh 1m6
        </Typography>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography variant="h6" color="error" fontWeight="bold">
            8,990,000đ
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'line-through' }}
          >
            11,990,000đ
          </Typography>
        </Box>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Rating value={4} readOnly precision={1} size="small" />
          <Typography variant="body2" ml={1}>
            (7)
          </Typography>
        </Box>

        {/* Sold */}
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Đã bán 19
        </Typography>

        {/* Colors */}
        <Stack direction="row" spacing={1} mt={1}>
          {['#EDE4D3', '#F4F1EB', '#5E4B3C'].map((color, index) => (
            <Box
              key={index}
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: color,
                border: '1px solid #ccc',
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
