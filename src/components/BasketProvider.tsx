import { BasketsContext } from "../context/BasketsContext";
import { useBaskets } from "../hooks/useBaskets";

const BasketProvider: React.FC = ({ children }) => {
  const { refresh, refreshTime, baskets } = useBaskets();
  return (
    <BasketsContext.Provider value={{ data: { refreshTime, baskets }, refresh }}>
      {children}
    </BasketsContext.Provider>
  )
}

export default BasketProvider;