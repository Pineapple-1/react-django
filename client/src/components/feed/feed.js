import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Redirect } from "react-router";
import Card from "../card/card";
import Post from "../post/post";

import api from "../../api/index";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
}));

export default function Feed({ Token }) {
  const [feedItems, setFeedItems] = useState("");
  const [users, setUsers] = useState("");
  const [text, setText] = useState("");
  const [update, setUpdate] = useState("");
  const [value, setValue] = useState("");

  const classes = useStyles();
  useEffect(() => {
    async function fetchData() {
      const request = await api.get("feed/", {
        headers: { Authorization: `Token ${Token}` },
      });
      console.log(request.data);
      setFeedItems(request.data);
      fetchUser();
      return request.data;
    }
    async function fetchUser() {
      const request = await api.get("profile/");
      console.log(request.data);
      setUsers(request.data);
      return request.data;
    }

    if (Token) {
      fetchData();
    }
  }, [Token]);

  return (
    <React.Fragment>
      <CssBaseline />

      <main>
        <Post
          Token={Token}
          setFeedItems={setFeedItems}
          setText={setText}
          text={text}
          update={update}
          setUpdate={setUpdate}
          value = {value}
          setValue= {setValue}
        />
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}

          <Grid container spacing={4}>
            {Token ? (
              feedItems && users ? (
                feedItems
                  .slice(0)
                  .reverse()
                  .map((feedItem) => (
                    <Grid item key={feedItem.id} xs={12} sm={6} md={4}>
                      <Card
                        text={feedItem.status_text}
                        date={feedItem.created_on}
                        likes={feedItem.likes}
                        email={
                          users.find(
                            (user) => user.id === feedItem.user_profile
                          ).email
                        }
                        name={
                          users.find(
                            (user) => user.id === feedItem.user_profile
                          ).name
                        }
                        Token={Token}
                        Pid={localStorage.getItem("email")}
                        Fid={feedItem.id}
                        setFeedItems={setFeedItems}
                        setText={setText}
                        update={update}
                        setUpdate={setUpdate}
                        value = {value}
                        setValue= {setValue}
                      />
                    </Grid>
                  ))
              ) : (
                <div>Loading</div>
              )
            ) : (
              <Redirect to="redirect/" />
            )}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}
