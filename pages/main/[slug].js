
import Footer from "../../components/layout/Footer";
import Main from "../../components/main/main";
import MyOGs from "../../components/main/myOGs";
import MainHeader from "../../components/layout/MainHeader";
import HoodyMarket from "../../components/main/hoodyMarket";
import Inventory from "../../components/main/inventory";
import TraitStore from "../../components/main/traitStore";
import NftMarketplace from "../../components/main/nftMarketplace";
import NftEdit from "../../components/main/nftEdit";
import PrerenderTailwind from "../../components/prerender/PrerenderTailwind";
import { useRouter } from "next/router";

export default function Home({authStatus}) {
  const router = useRouter();
  const { slug = "home" } = router.query;
  const components = {
    home: Main,
    market: HoodyMarket,
    inventory: Inventory,
    trait_store: TraitStore,
    ext_market: NftMarketplace,
    nft_edit: NftEdit,
    myOGs: MyOGs
  };

  const Component = components[slug];

  return (
    <div className="bg-[url('/images/main/mobileBG.svg')] sm:bg-[url('/images/main/mainBG.webp')] bg-no-repeat bg-cover">
      <PrerenderTailwind />
      <div className="flex flex-col min-h-screen font-desc2 tracking-wider">
        <MainHeader slug={slug} />
        <Component authStatus={authStatus}/>
        <Footer />
      </div>
    </div>
  );
}
