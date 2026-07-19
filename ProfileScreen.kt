package com.axora.app.ui.profile

import androidx.compose.animation.Crossfade
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.staggeredgrid.LazyVerticalStaggeredGrid
import androidx.compose.foundation.lazy.staggeredgrid.StaggeredGridCells
import androidx.compose.foundation.lazy.staggeredgrid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.TileMode
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ==========================================
// 🎨 AXORA PREMIUM SYSTEM DESIGN TOKENS
// ==========================================

object AxoraTheme {
    val Pink = Color(0xFFFF2D55)      // AxoraPink: Core accents and actions
    val Cyan = Color(0xFF22D3EE)      // AxoraCyan: Active status indicators and Pop Sessions
    val Violet = Color(0xFFA855F7)    // AxoraViolet: Playful highlights
    val Gold = Color(0xFFF59E0B)      // Premium Gold: Gamification & Coins
    val VerifiedGreen = Color(0xFF34D399) // Emerald: Certification Checked Badge

    // Surface Palette (Cybernetic Charcoal Colors for OLED Contrast)
    val Background = Color(0xFF0C0C0E)
    val SurfaceDark = Color(0xFF141416)
    val SurfaceLight = Color(0xFF1C1C1F)
    val BorderGlass = Color(0xFFFFFFFF).copy(alpha = 0.08f)
    val TextPrimary = Color(0xFFFFFFFFF)
    val TextSecondary = Color(0xFFA1A1AA)

    // Layout Shapes
    val BentoShape = RoundedCornerShape(28.dp)
    val PillShape = RoundedCornerShape(100.dp)
}

// ==========================================
// 🚀 MAIN IMMERSIVE PROFILE COMPONENT
// ==========================================

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    onBackClick: () -> Unit = {},
    onEditProfileClick: () -> Unit = {},
    onJoinPopSessionClick: () -> Unit = {}
) {
    // Component State declarations
    var isLive by remember { mutableStateOf(true) }
    var selectedTab by remember { mutableStateOf(ProfileTab.POSTS) }

    // Mock profiles inputs
    val userName = "Auteur Invité"
    val userTag = "@invite_axo"
    val userBio = "🌟 Explorateur des interfaces Bento, amoureux des esthétiques cyberpunk et créatif de l'écosystème Axora. Toujours à la recherche des meilleurs débats et d'échanges bienveillants !"

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = userName,
                        fontFamily = FontFamily.SansSerif,
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 14.sp,
                        color = AxoraTheme.TextPrimary,
                        letterSpacing = 1.sp
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Go Back",
                            tint = AxoraTheme.TextPrimary
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = AxoraTheme.Background,
                    titleContentColor = AxoraTheme.TextPrimary
                )
            )
        },
        containerColor = AxoraTheme.Background
    ) { innerPadding ->
        
        // Single LazyColumn strategy avoids all nested scroll conflicts
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(AxoraTheme.Background),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            
            // 1️⃣ Header Layer (Live Banner & Verified Avatar Ring)
            item {
                ProfileHeaderSection(
                    userName = userName,
                    userTag = userTag,
                    isLive = isLive,
                    onAvatarClick = { isLive = !isLive }
                )
            }

            // 2️⃣ Gamified Metrics Cell (Followers, Total Views, Premium Coins Counter)
            item {
                GamifiedMetricsDashboard()
            }

            // 3️⃣ Asymmetric Profile Core (Bio Hub, Live Reel Tall display, Pop Session)
            item {
                InteractiveBentoGrid(
                    userBio = userBio,
                    onJoinPopSessionClick = onJoinPopSessionClick
                )
            }

            // 4️⃣ Content Matrix Tabs Switcher ("POSTS", "REELS", "SAVED")
            item {
                ContentTabsSelection(
                    selectedTab = selectedTab,
                    onTabChanged = { selectedTab = it }
                )
            }

            // 5️⃣ Content Matrix Items list
            item {
                ContentPortfolioArchive(selectedTab = selectedTab)
            }

            // Margin bottom spacing offset
            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

// ==========================================
// 🛠️ SUB-COMPONENTS & LAYOUT PARTS
// ==========================================

/**
 * 📸 Header segment incorporating:
 * - Ultra-blurred Live Banner Photo Backdrop
 * - Double-neon Ring Verified Avatar (Cyan=Live, Pink=Stories)
 * - Green verified insignia
 * - Discord/BeReal inspired status capsule box
 */
@Composable
fun ProfileHeaderSection(
    userName: String,
    userTag: String,
    isLive: Boolean,
    onAvatarClick: () -> Unit
) {
    val transition = rememberInfiniteTransition(label = "NeonGlintAnimation")
    val bannerScale by transition.animateFloat(
        initialValue = 1.0f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(4000, easing = EaseInOutSine),
            repeatMode = RepeatMode.Reverse
        ),
        label = "BannerParallax"
    )

    // State animation for the neon status rings
    val glowColor by animateColorAsState(
        targetValue = if (isLive) AxoraTheme.Cyan else AxoraTheme.Pink,
        animationSpec = tween(500),
        label = "StatusNeonGlowColor"
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(AxoraTheme.BentoShape)
            .background(AxoraTheme.SurfaceDark)
            .border(1.dp, AxoraTheme.BorderGlass, AxoraTheme.BentoShape)
    ) {
        // Banner portion
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(130.dp)
                .background(Color.Black)
        ) {
            // Blurred loop simulation via a layered color mesh + blur scale
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .drawWithContent {
                        drawContent()
                        drawRect(
                            brush = Brush.radialGradient(
                                colors = listOf(AxoraTheme.Pink.copy(alpha = 0.3f), Color.Transparent),
                                tileMode = TileMode.Clamp
                            )
                        )
                    }
            ) {
                // Background Gradient Grid overlay
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .blur(8.dp)
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    AxoraTheme.SurfaceLight,
                                    AxoraTheme.Pink.copy(alpha = 0.15f),
                                    AxoraTheme.Background
                                )
                            )
                        )
                )
            }

            // Live Banner indicator badge element
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(12.dp)
                    .background(Color.Black.copy(alpha = 0.6f), AxoraTheme.PillShape)
                    .border(1.dp, Color.White.copy(alpha = 0.12f), AxoraTheme.PillShape)
                    .padding(horizontal = 10.dp, vertical = 4.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(5.dp)
                            .clip(CircleShape)
                            .background(AxoraTheme.Pink)
                    )
                    Text(
                        text = "LIVE REEL LOOP",
                        fontSize = 8.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        color = AxoraTheme.Pink,
                        letterSpacing = 1.5.sp
                    )
                }
            }
        }

        // User Identity overlaps the banner backdrop
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .padding(bottom = 20.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                
                // Avatar frame overlapping relative boundary of the banner
                Box(
                    modifier = Modifier
                        .offset(y = (-40).dp)
                        .size(90.dp)
                        .clip(CircleShape)
                        .background(AxoraTheme.Background)
                        .padding(3.dp)
                        .drawWithContent {
                            drawContent()
                            drawCircle(
                                brush = Brush.sweepGradient(
                                    colors = listOf(glowColor, glowColor.copy(alpha = 0.2f), glowColor)
                                ),
                                radius = size.minDimension / 2.0f,
                                style = androidx.compose.ui.graphics.drawscope.Stroke(width = 4.dp.toPx())
                            )
                        }
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                            onClick = onAvatarClick
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    // Placeholder representing a profile picture
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(CircleShape)
                            .background(AxoraTheme.SurfaceLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "AX",
                            fontFamily = FontFamily.SansSerif,
                            fontWeight = FontWeight.Black,
                            fontSize = 24.sp,
                            color = glowColor
                        )
                    }
                }

                // Name and Verified tag section
                Column(
                    modifier = Modifier.offset(y = (-24).dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = userName,
                            fontFamily = FontFamily.SansSerif,
                            fontWeight = FontWeight.Black,
                            fontSize = 18.sp,
                            color = AxoraTheme.TextPrimary,
                            letterSpacing = (-0.5).sp
                        )
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = "Verified Identity",
                            tint = AxoraTheme.VerifiedGreen,
                            modifier = Modifier.size(16.dp)
                        )
                    }

                    Text(
                        text = userTag,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = AxoraTheme.TextSecondary
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // "Right Now" Status Card Capsule
                    Box(
                        modifier = Modifier
                            .background(Color.White.copy(alpha = 0.03f), AxoraTheme.PillShape)
                            .border(1.dp, Color.White.copy(alpha = 0.05f), AxoraTheme.PillShape)
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(6.dp)
                                    .clip(CircleShape)
                                    .background(AxoraTheme.VerifiedGreen)
                            )
                            Text(
                                text = "Coding the matrix...",
                                fontFamily = FontFamily.SansSerif,
                                fontWeight = FontWeight.Bold,
                                fontSize = 10.sp,
                                color = Color.White.copy(alpha = 0.85f)
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * 📊 Balanced gamified statistics dashboard cell.
 * Includes total count numbers and nested gold capsule representing pop coins.
 */
@Composable
fun GamifiedMetricsDashboard() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(AxoraTheme.BentoShape)
            .background(AxoraTheme.SurfaceDark)
            .border(1.dp, AxoraTheme.BorderGlass, AxoraTheme.BentoShape)
            .padding(18.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Stats grid
        Row(
            modifier = Modifier.weight(1.0f),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "FOLLOWERS",
                    fontSize = 8.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black,
                    color = AxoraTheme.Pink,
                    letterSpacing = 1.2.sp
                )
                Text(
                    text = "14.8K",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    color = AxoraTheme.TextPrimary
                )
                Text(
                    text = "▲ +12% this wk",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = AxoraTheme.VerifiedGreen,
                    fontFamily = FontFamily.Monospace
                )
            }

            Box(
                modifier = Modifier
                    .width(1.dp)
                    .fillMaxHeight()
                    .background(Color.White.copy(alpha = 0.05f))
            )

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "TOTAL VIEWS",
                    fontSize = 8.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black,
                    color = AxoraTheme.Cyan,
                    letterSpacing = 1.2.sp
                )
                Text(
                    text = "5.8M",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    color = AxoraTheme.TextPrimary
                )
                Text(
                    text = "total views",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Medium,
                    color = AxoraTheme.TextSecondary
                )
            }
        }

        // Nest Pop Coins capsule
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(18.dp))
                .background(AxoraTheme.Gold.copy(alpha = 0.08f))
                .border(1.dp, AxoraTheme.Gold.copy(alpha = 0.2f), RoundedCornerShape(18.dp))
                .padding(horizontal = 12.dp, vertical = 10.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(26.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(AxoraTheme.Gold.copy(alpha = 0.15f))
                        .border(1.dp, AxoraTheme.Gold.copy(alpha = 0.3f), RoundedCornerShape(8.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = "Pop Coins Logo",
                        tint = AxoraTheme.Gold,
                        modifier = Modifier.size(14.dp)
                    )
                }

                Column {
                    Text(
                        text = "AXORA COINS",
                        fontSize = 7.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        color = AxoraTheme.Gold.copy(alpha = 0.8f)
                    )
                    Text(
                        text = "250 coins",
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Black,
                        color = AxoraTheme.Gold
                    )
                }
            }
        }
    }
}

/**
 * 🧩 Grid Core: Alternating asymmetrical modules.
 * Instead of rigid squares, uses custom Column/Row groupings to simulate a stunning Bento layout natively.
 */
@Composable
fun InteractiveBentoGrid(
    userBio: String,
    onJoinPopSessionClick: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        
        // Horizontal division
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            
            // Cell A: The "Hyper-Link & Bio" Block
            Column(
                modifier = Modifier
                    .weight(1.8f)
                    .clip(AxoraTheme.BentoShape)
                    .background(AxoraTheme.SurfaceDark)
                    .border(1.dp, AxoraTheme.BorderGlass, AxoraTheme.BentoShape)
                    .padding(20.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(AxoraTheme.Pink)
                        )
                        Text(
                            text = "BIO & EXTERNAL PLUGS",
                            fontSize = 8.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Black,
                            color = AxoraTheme.Pink,
                            letterSpacing = 1.2.sp
                        )
                    }

                    Text(
                        text = userBio,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.White.copy(alpha = 0.8f),
                        lineHeight = 16.sp
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Interactive Glowing Pill Tags
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    PillLinkTag(text = "@invite_axo", focusColor = AxoraTheme.Pink)
                    PillLinkTag(text = "axora.design", focusColor = AxoraTheme.Cyan)
                }
            }

            // Cell C: The "Pop Session" Capsule
            Column(
                modifier = Modifier
                    .weight(1.2f)
                    .clip(AxoraTheme.BentoShape)
                    .background(AxoraTheme.SurfaceDark)
                    .border(1.dp, AxoraTheme.Cyan.copy(alpha = 0.3f), AxoraTheme.BentoShape)
                    .padding(16.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "POP ROOM",
                            fontSize = 8.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Black,
                            color = AxoraTheme.Cyan,
                            letterSpacing = 1.2.sp
                        )
                        Box(
                            modifier = Modifier
                                .background(AxoraTheme.Cyan.copy(alpha = 0.2f), AxoraTheme.PillShape)
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                "ACTIVE",
                                fontSize = 7.sp,
                                fontWeight = FontWeight.Black,
                                color = AxoraTheme.Cyan,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }

                    Text(
                        text = "Tech Hub Digital Review: Neon Bento Design Guidelines",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = AxoraTheme.TextPrimary,
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis,
                        lineHeight = 14.sp
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Button(
                    onClick = onJoinPopSessionClick,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = AxoraTheme.Cyan.copy(alpha = 0.15f),
                        contentColor = AxoraTheme.Cyan
                    ),
                    shape = RoundedCornerShape(12.dp),
                    contentPadding = PaddingValues(vertical = 4.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, AxoraTheme.Cyan.copy(alpha = 0.3f))
                ) {
                    Text(
                        text = "REJOINDRE",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.sp
                    )
                }
            }
        }

        // Cell B: Live Reel Banner (Presents a simulated video preview)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(115.dp)
                .clip(AxoraTheme.BentoShape)
                .background(AxoraTheme.SurfaceLight)
                .border(1.dp, AxoraTheme.BorderGlass, AxoraTheme.BentoShape)
        ) {
            // Simulated video thumbnail gradient
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .blur(2.dp)
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                AxoraTheme.SurfaceDark,
                                AxoraTheme.Pink.copy(alpha = 0.08f),
                                AxoraTheme.SurfaceLight
                            )
                        )
                    )
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "PINNED SHORT-FORM SHOWCASE",
                        fontSize = 8.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Black,
                        color = AxoraTheme.Pink,
                        letterSpacing = 1.5.sp
                    )
                    
                    Box(
                        modifier = Modifier
                            .background(Color.White.copy(alpha = 0.1f), AxoraTheme.PillShape)
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = "2.5M VIEWS",
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 8.sp,
                            color = Color.White,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    Column {
                        Text(
                            text = "Animation Principles in Compose v3",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = AxoraTheme.TextPrimary
                        )
                        Text(
                            text = "Aesthetic performance overlays",
                            fontSize = 9.sp,
                            color = AxoraTheme.TextSecondary
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(AxoraTheme.Pink.copy(alpha = 0.2f))
                            .border(1.dp, AxoraTheme.Pink.copy(alpha = 0.4f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("▶", fontSize = 9.sp, color = AxoraTheme.Pink, modifier = Modifier.offset(x = 1.dp))
                    }
                }
            }
        }
    }
}

/**
 * 🏷️ Mini glowing pill link element.
 */
@Composable
fun PillLinkTag(text: String, focusColor: Color) {
    Box(
        modifier = Modifier
            .clip(AxoraTheme.PillShape)
            .background(focusColor.copy(alpha = 0.08f))
            .border(1.dp, focusColor.copy(alpha = 0.25f), AxoraTheme.PillShape)
            .padding(horizontal = 12.dp, vertical = 5.dp)
    ) {
        Text(
            text = text,
            fontSize = 9.sp,
            fontFamily = FontFamily.Monospace,
            fontWeight = FontWeight.Bold,
            color = AxoraTheme.TextPrimary
        )
    }
}

/**
 * 🎛️ Clean scrolling tabs selection header.
 * Crossfade and sliding highlight bar indicators.
 */
@Composable
fun ContentTabsSelection(
    selectedTab: ProfileTab,
    onTabChanged: (ProfileTab) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(AxoraTheme.PillShape)
            .background(Color.White.copy(alpha = 0.02f))
            .border(1.dp, AxoraTheme.BorderGlass, AxoraTheme.PillShape)
            .padding(4.dp),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        ProfileTab.values().forEach { tab ->
            val isCurrent = tab == selectedTab
            val activeGlowColor by animateColorAsState(
                targetValue = if (isCurrent) AxoraTheme.Pink else Color.Transparent,
                label = "TabPulseGlowColor"
            )

            Box(
                modifier = Modifier
                    .weight(1.0f)
                    .clip(AxoraTheme.PillShape)
                    .background(if (isCurrent) Color.White.copy(alpha = 0.03f) else Color.Transparent)
                    .border(
                        width = 1.dp,
                        color = if (isCurrent) Color.White.copy(alpha = 0.05f) else Color.Transparent,
                        shape = AxoraTheme.PillShape
                    )
                    .clickable { onTabChanged(tab) }
                    .padding(vertical = 10.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = tab.name,
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = if (isCurrent) FontWeight.ExtraBold else FontWeight.Bold,
                        color = if (isCurrent) AxoraTheme.TextPrimary else AxoraTheme.TextSecondary,
                        letterSpacing = 1.5.sp
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Box(
                        modifier = Modifier
                            .width(16.dp)
                            .height(2.dp)
                            .clip(CircleShape)
                            .background(activeGlowColor)
                    )
                }
            }
        }
    }
}

/**
 * 📦 High performance Grid feed loader.
 * Emulates the aesthetic masonry layout natively in Compose.
 */
@Composable
fun ContentPortfolioArchive(selectedTab: ProfileTab) {
    val items = when (selectedTab) {
        ProfileTab.POSTS -> listOf(
            ContentEntity(title = "Bento Grid Redesign x2", desc = "Exploration de l'asymétrie.", tag = "DESIGN", ratio = 1.2f),
            ContentEntity(title = "Interactive Code Review", desc = "Performances audio Pop session.", tag = "ENGINE", ratio = 0.9f),
            ContentEntity(title = "L'Afrique en Tech Meetup", desc = "Première édition physique.", tag = "TECH", ratio = 1.5f),
            ContentEntity(title = "Build for the culture, deploy globally", desc = "Manifesto.", tag = "VISION", ratio = 0.7f)
        )
        ProfileTab.REELS -> listOf(
            ContentEntity(title = "Tuto Bento Design", desc = "1.2M views • 30s", tag = "REEL", ratio = 1.6f),
            ContentEntity(title = "Pop Session Highlights", desc = "840K views • 15s", tag = "LIVE", ratio = 1.6f),
            ContentEntity(title = "Clean Code review PRs", desc = "420K views • 45s", tag = "DEV", ratio = 1.6f)
        )
        ProfileTab.SAVED -> listOf(
            ContentEntity(title = "CSS Custom Animation Easing", desc = "Outils d'ergonomie.", tag = "TOOLS", ratio = 1.0f),
            ContentEntity(title = "Asymmetric cryptography basics", desc = "Sécurité end-to-end.", tag = "TRUST", ratio = 1.3f)
        )
    }

    // Compose Native Grid layout matching the staggered style specified in visual rules
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items.chunked(2).forEach { pair ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                pair.forEach { entity ->
                    Box(
                        modifier = Modifier
                            .weight(1.0f)
                            .clip(RoundedCornerShape(20.dp))
                            .background(AxoraTheme.SurfaceDark)
                            .border(1.dp, AxoraTheme.BorderGlass, RoundedCornerShape(20.dp))
                            .padding(14.dp)
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Box(
                                modifier = Modifier
                                    .background(
                                        color = if (entity.tag == "REEL" || entity.tag == "DESIGN") AxoraTheme.Pink.copy(alpha = 0.1f) else AxoraTheme.Cyan.copy(alpha = 0.1f),
                                        shape = RoundedCornerShape(6.dp)
                                    )
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = entity.tag,
                                    fontSize = 7.sp,
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Black,
                                    color = if (entity.tag == "REEL" || entity.tag == "DESIGN") AxoraTheme.Pink else AxoraTheme.Cyan
                                )
                            }

                            Text(
                                text = entity.title,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = AxoraTheme.TextPrimary,
                                maxLines = 2,
                                overflow = TextOverflow.Ellipsis
                            )

                            Text(
                                text = entity.desc,
                                fontSize = 9.sp,
                                color = AxoraTheme.TextSecondary,
                                lineHeight = 12.sp
                            )
                        }
                    }
                }
                if (pair.size == 1) {
                    Spacer(modifier = Modifier.weight(1.0f))
                }
            }
        }
    }
}

// ==========================================
// 🗂️ SUPPORTING ENUMS AND DATA SCHEMAS
// ==========================================

enum class ProfileTab {
    POSTS, REELS, SAVED
}

data class ContentEntity(
    val title: String,
    val desc: String,
    val tag: String,
    val ratio: Float
)

// ==========================================
// 🔍 PREVIEW SYSTEM RENDERING
// ==========================================

@Preview(showBackground = true)
@Composable
fun ProfileScreenPreview() {
    MaterialTheme {
        ProfileScreen()
    }
}
