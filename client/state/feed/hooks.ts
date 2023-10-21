import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { subscribeAction, unsubscribeAction } from "./actions";

export function useFeed () {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(subscribeAction());
    return () => {
      dispatch(unsubscribeAction())
    };
  }, [dispatch])
}
