import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00A8E8",
  },
  header: {
    backgroundColor: "#00A8E8",
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 2,
  },
  locationText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  actionBanner: {
    backgroundColor: "#E91E63",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#EEF2F6",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 32,
    paddingHorizontal: 30,
    backgroundColor: "#EEF2F6",
  },
  navItem: {
    alignItems: "center",
    width: 95,
  },
  navIcon: {
    width: 70,
    height: 70,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#5EC8F2",
    shadowOffset: { 
      width: 0, 
      height: 10 
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  navLabel: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
    textAlign: "center",
  },
  carouselContainer: {
    marginTop: 16,
  },
  bannerCard: {
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginLeft: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  bannerContent: {
    padding: 20,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  carouselDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#BDBDBD",
  },
  activeDot: {
    backgroundColor: "#00A8E8",
    width: 24,
  },
  pharmaciesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A237E",
  },
  seeMoreText: {
    fontSize: 14,
    color: "#00A8E8",
    fontWeight: "600",
  },
  pharmaciesList: {
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 14,
  },
  seeMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  }
});