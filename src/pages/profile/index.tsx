import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Link,
  Typography,
  Theme
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { api } from "../../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  iconImageUrl: string | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: theme.palette.primary.main,
    boxShadow: 'none',
  },
  text: {
    color: theme.palette.secondary.main,
  },
  subText: {
    color: theme.palette.grey[400],
  },
  avatar: {
    margin: '0 auto',
  }
}));

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<User>();
  const classes = useStyles();

  useEffect(() => {
    api.get("/account").then(response => {
      console.log(response.data.user);
      setCurrentUser(response.data.user);
    })
  }, []);

  return (
    <div className={classes.root}>
      <Header />
      <Container maxWidth="md" className={classes.root}>
        <Link href="/profile/update">
          <Typography variant="h4" align="right" className={classes.text} mb={2}>
            編集
          </Typography>
        </Link>
        <Avatar
          className={classes.avatar}
          alt={currentUser?.name}
          src={currentUser?.iconImageUrl}
          sx={{ width: 185, height: 185 }}
        />
        <Box>
          <Typography variant="h4" align="center" className={classes.text} mt={8} mb={2}>
            {currentUser?.name}
          </Typography>
          <Typography variant="h6" align="center" className={classes.subText} mb={2}>
            {currentUser?.email}
          </Typography>
        </Box>

        {/* <Card
          sx={{ display: 'flex', flexDirection: 'column' }}
          className={classes.root}
        >
          <CardHeader
            avatar={
              <Avatar
                src={currentUser?.iconImageUrl}
                sx={{ width: 85, height: 85, flex: '1 0 auto'  }}
              />
            }
            action={
              <Link href="profile/update" underline="none">

              </Link>
            }
            className={classes.root}
          />
          <CardMedia
            component="img"
            height="194"
            image="/static/images/cards/paella.jpg"
            alt="Paella dish"
            className={classes.root}
          />
          <CardContent className={classes.root}>
            <Avatar
              src={currentUser?.iconImageUrl}
              sx={{ width: 120, height: 85 }}
            />
          </CardContent>
        </Card> */}
      </Container>
    </div>
  )
}
