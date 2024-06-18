import { useContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Dialog, Stack, TextField } from '@fluentui/react'
import ambition from "../../assets/ambition.png"
import leadingai from "../../assets/leadingai.svg"
import engine from "../../assets/Engine-Mark.svg"
import morley from "../../assets/morley.png"
import engineLogo from "../../assets/Engine-Logo.svg"
import fea from "../../assets/fea.svg"
import coram from "../../assets/coram.gif"
import glasgowuni from "../../assets/glasgowuni.svg"
import tri from "../../assets/tri.png"
import { CopyRegular } from '@fluentui/react-icons'

import { CosmosDBStatus } from '../../api'
import Contoso from '../../assets/Contoso.svg'
import { HistoryButton, ShareButton } from '../../components/common/Button'
import { AppStateContext } from '../../state/AppProvider'

import styles from './Layout.module.css'

const Layout = () => {
  const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false)
  const [copyClicked, setCopyClicked] = useState<boolean>(false)
  const [copyText, setCopyText] = useState<string>('Copy URL')
  const [shareLabel, setShareLabel] = useState<string | undefined>('Share')
  const [hideHistoryLabel, setHideHistoryLabel] = useState<string>('Hide chat history')
  const [showHistoryLabel, setShowHistoryLabel] = useState<string>('Show chat history')
  const appStateContext = useContext(AppStateContext)
  const ui = appStateContext?.state.frontendSettings?.ui

    type ImageImports = {
        [key: string]: string;
      };
    
      const imageImports: ImageImports = {
        leadingai: leadingai,
        ambition: ambition,
        engine: engine,
        engineLogo: engineLogo,
        morley: morley,
        coram: coram,
        glasgowuni: glasgowuni,
        fea: fea,
        tri: tri
        // Add more entries as needed for other images
      };

    const handleShareClick = () => {
        // setIsSharePanelOpen(true);
        window.open(ui?.share_button_link, '_blank', 'noopener,noreferrer');
    };

  const handleSharePanelDismiss = () => {
    setIsSharePanelOpen(false)
    setCopyClicked(false)
    setCopyText('Copy URL')
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopyClicked(true)
  }

  const handleHistoryClick = () => {
    appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
  }

  useEffect(() => {
    if (copyClicked) {
      setCopyText('Copied URL')
    }
  }, [copyClicked])

  useEffect(() => {}, [appStateContext?.state.isCosmosDBAvailable.status])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setShareLabel(undefined)
        setHideHistoryLabel('Hide history')
        setShowHistoryLabel('Show history')
      } else {
        setShareLabel('Share')
        setHideHistoryLabel('Hide chat history')
        setShowHistoryLabel('Show chat history')
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

    
    const dynamicImage = ui?.logo
    ? imageImports[ui.logo] || ""
    : "";

    useEffect(() => {
        // Update the background color of the html element
        document.documentElement.style.backgroundColor = ui?.header_color || '';
      }, [ui?.header_color]);
      
    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"} style={{backgroundColor: ui?.header_color}}>
                <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
                    <Stack horizontal verticalAlign="center">
                        {ui?.show_logo && <img
                            src={dynamicImage}
                            className={styles.headerIcon}
                            aria-hidden="true"
                        />}
                        <Link to="/" className={styles.headerTitleContainer}>
                            <h1 className={styles.headerTitle} style={{color: ui?.title_text_color}}>{ui?.title}</h1>
                        </Link>
                    </Stack>
                        <Stack horizontal tokens={{ childrenGap: 4 }} style={{marginRight: '25px'}}>
                            {(appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured && ui?.show_history_button) &&
                                <HistoryButton onClick={handleHistoryClick} text={appStateContext?.state?.isChatHistoryOpen ? hideHistoryLabel : showHistoryLabel} />
                            }
                            {ui?.show_share_button && <ShareButton onClick={handleShareClick} text={ui?.share_button_text} />}
                        </Stack>
                    
                </Stack>
            </header>
            <Outlet />
            <Dialog
                onDismiss={handleSharePanelDismiss}
                hidden={!isSharePanelOpen}
                styles={{

                    main: [{
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                maxWidth: '600px',
                                background: "#FFFFFF",
                                boxShadow: "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                                borderRadius: "8px",
                                maxHeight: '200px',
                                minHeight: '100px',
                            }
                        }
                    }]
                }}
                dialogContentProps={{
                    title: "Share the web app",
                    showCloseButton: true
                }}
            >
                <Stack horizontal verticalAlign="center" style={{ gap: "8px" }}>
                    <TextField className={styles.urlTextBox} defaultValue={window.location.href} readOnly />
                    <div
                        className={styles.copyButtonContainer}
                        role="button"
                        tabIndex={0}
                        aria-label="Copy"
                        onClick={handleCopyClick}
                        onKeyDown={e => e.key === "Enter" || e.key === " " ? handleCopyClick() : null}
                    >
                        <CopyRegular className={styles.copyButton} />
                        <span className={styles.copyButtonText}>{copyText}</span>
                    </div>
                </Stack>
            </Dialog>
        </div>
      );
  }
export default Layout
